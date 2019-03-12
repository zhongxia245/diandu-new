<?php
/**
 * desription 判断是否gif动画
 * @param sting $image_file图片路径
 * @return boolean t 是 f 否
 */
function check_gifcartoon($image_file)
{
    $fp = fopen($image_file, 'rb');
    $image_head = fread($fp, 1024);
    fclose($fp);
    return preg_match("/" . chr(0x21) . chr(0xff) . chr(0x0b) . 'NETSCAPE2.0' . "/", $image_head) ? false : true;
}

/**
 * 参考地址：链接中的 方法2可行，方法1不可行
 * http://www.php.cn/php-weizijiaocheng-377677.html
 * desription 压缩图片
 * @param sting $imgsrc 图片路径
 * @param string $imgdst 压缩后保存路径
 */
function resize_image($imgsrc, $imgdst)
{
    list($width, $height, $type) = getimagesize($imgsrc);
    if ($width >= 1920) {
        $new_width = 1920;
        $new_height = ($height / $width) * 1920;
        $quality = 70;
    } else if ($height >= 1080) {
        $new_height = 1080;
        $new_width = ($width / $height) * 1080;
        $quality = 70;
    } else {
        $new_width = $width;
        $new_height = $height;
        $quality = 90;
    }
    switch ($type) {
        case 1:
            // GIF 图片压缩就没有动画了，不压缩
            // $giftype = check_gifcartoon($imgsrc);
            // if ($giftype) {
            //     header('Content-Type:image/gif');
            //     $image_wp = imagecreatetruecolor($new_width, $new_height);
            //     $image = imagecreatefromgif($imgsrc);
            //     imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            //     $result = imagejpeg($image_wp, $imgdst, $quality);
            //     imagedestroy($image_wp);
            // }
            return 1;
        case 2:
            header('Content-Type:image/jpeg');
            $image_wp = imagecreatetruecolor($new_width, $new_height);
            $image = imagecreatefromjpeg($imgsrc);
            imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            $result = imagejpeg($image_wp, $imgdst, $quality);
            imagedestroy($image_wp);
            return $result;
        case 3:
            header('Content-Type:image/png');
            $image_wp = imagecreatetruecolor($new_width, $new_height);
            $image = imagecreatefrompng($imgsrc);
            imagecopyresampled($image_wp, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            $result = imagejpeg($image_wp, $imgdst, $quality);
            imagedestroy($image_wp);
            return $result;
    }
}

//设置上传目录
$path = "../uploads/"; //上传路径
$path_tmp = "../uploads_tmp/"; //分片上传时分片文件临时存储路径。
$returnPath = "uploads/"; //返回前端路径
if (!empty($_FILES)) {

    //得到上传的临时文件流
    $tempFile = $_FILES['file']['tmp_name'];

    //允许的文件后缀
    $fileTypes = array('jpg', 'jpeg', 'gif', 'png', 'mp3', 'mp4', 'lrc', 'obj');

    //图片文件后缀
    $imgFile = array('jpg', 'jpeg', 'png');

    //得到文件原名
    //$fileName = iconv("UTF-8","GB2312",$_FILES["file"]["name"]);
    $fileName = $_FILES["file"]["name"];

    //上传文件的后缀
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $ext = strtolower($ext);
    if (!in_array($ext, $fileTypes)) {
        echo json_encode($fileName . "--file type not allowed error!");
        exit();
    }

    // FIXED：文件名，当前获取方式不可靠，需改进。建议前端post数据时创建一个全局唯一随机数同form一并提交作为文件名
    $filename = md5($_POST['id'] . $_POST['size'] . $_POST['chunks'] . $_POST['uuid']);

    if (!file_exists($path_tmp)) {
        @mkdir($path_tmp, 0777);
    }
    $chunk = isset($_POST['chunk']) ? intval($_POST['chunk']) : 0;
    $chunks = isset($_POST['chunks']) ? intval($_POST['chunks']) : 1;
    $chunk_file_append = $path_tmp . $filename . '_';

    @move_uploaded_file($_FILES['file']['tmp_name'], $chunk_file_append . $chunk . '.part');

    $index = 0;
    $done = true;
    for ($index = 0; $index < $chunks; $index++) {
        if (!file_exists("{$chunk_file_append}{$index}.part")) {
            $done = false;
            break;
        }
    }

    if ($done) {
        $out = @fopen($path . $filename . '.' . $ext, 'wb');
        if (flock($out, LOCK_EX)) {
            for ($index = 0; $index < $chunks; $index++) {
                if (!$in = @fopen("{$chunk_file_append}{$index}.part", 'rb')) {
                    break;
                }
                while ($buff = fread($in, 4096)) {
                    fwrite($out, $buff);
                }
                @fclose($in);
                @unlink("{$chunk_file_append}{$index}.part");
            }
            flock($out, LOCK_UN);
        }
        @fclose($out);

        //上传成功，返回保存的文件路径
        if (in_array($ext, $imgFile)) {
            //压缩图片
            $ret = resize_image($path . $filename . '.' . $ext , $path . $filename . '.' . $ext);
            if (!$ret) {
                echo json_encode($fileName . "--image resize error!");
                exit();
            }
        }
        echo json_encode($returnPath . $filename . '.' . $ext);
    }
}
