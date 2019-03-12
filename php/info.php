<?php echo md5(uniqid(mt_rand(), true)) ?>
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

?>

<?php echo resize_image('./1.png', './1-min.png') ?>
<?php echo resize_image('./2.jpg', './2-min.jpg') ?>
