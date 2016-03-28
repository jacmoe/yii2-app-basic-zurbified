<?php
namespace app\assets;

use yii\web\AssetBundle;

class AppAsset extends AssetBundle
{
    public $sourcePath = '@app/assets/dist';
    public $css = [
        YII_ENV_DEV ? 'css/app.css' : 'css/app.min.css'
    ];
    public $js = [
        YII_ENV_DEV ? 'js/app.js' : 'js/app.min.js',
        YII_ENV_DEV ? 'js/custom.js' : 'js/custom.min.js'
    ];
}
