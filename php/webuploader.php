<?php
function resize_image($uploadedfile, $dst)
{
    //     上传的图片文件
    $src = imagecreatefromjpeg($uploadedfile);
    //     原图片尺寸
    list($width, $height) = getimagesize($uploadedfile);

    //新    图片尺寸
    if ($width > 1920) {
        $newwidth = 1920;
        $newheight = ($height / $width) * 1920;
    } else if ($height > 1080) {
        $newheight = 1080;
        $newwidth = ($width / $height) * 1080;
    } else {
        $newheight = $height;
        $newwidth = $width;
    }

    //     按新尺寸创建临时图片文件
    $tmp = imagecreatetruecolor($newwidth, $newheight);
    //     压缩图片到临时文件
    imagecopyresampled($tmp, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    //     将临时文件保存到指定文件
    $ret = imagejpeg($tmp, $dst, 70);

    imagedestroy($src);
    imagedestroy($tmp);

    return $ret;

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
            //图片文件，判断是否需要压缩
            // 原图片尺寸
            list($width, $height) = getimagesize($path . $filename . '.' . $ext);
            if ($width > 1920 || $height > 1080) {
                //压缩图片
                $ret = resize_image($path . $filename . '.' . $ext, $path . $filename . '.' . $ext);
                if (!$ret) {
                    echo json_encode($fileName . "--image resize error!");
                    exit();
                }
            }
        }
        echo json_encode($returnPath . $filename . '.' . $ext);
    }
}
