<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use app\components\Nav;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div class="wrap">
    <header>
        <div class="top-bar">
            <div class="row">
                <div class="top-bar-left">
                    <ul class="menu">
                        <li class="menu-text">
                            <a href="<?= Yii::$app->homeUrl ?>">My Company</a>
                        </li>
                    </ul>
                </div>
                <div class="top-bar-right">
                    <?php
                    echo Nav::widget([
                        'options' => ['class' => 'menu'],
                        'items' => [
                            ['label' => 'Home', 'url' => ['/site/index']],
                            ['label' => 'About', 'url' => ['/site/about']],
                            ['label' => 'Contact', 'url' => ['/site/contact']],
                            Yii::$app->user->isGuest ? (
                                ['label' => 'Login', 'url' => ['/site/login']]
                            ) : (
                                '<li>'
                                . Html::beginForm(['/site/logout'], 'post')
                                . Html::submitButton(
                                    'Logout (' . Yii::$app->user->identity->username . ')',
                                    ['class' => 'button']
                                )
                                . Html::endForm()
                                . '</li>'
                            )
                        ],
                    ]);
                    ?>
                </div>
            </div>
        </div>
    </header>
    <div class="row">
        <?= Breadcrumbs::widget([
            'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
            'options' => ['class' => 'breadcrumbs'],
        ]) ?>
        <?= $content ?>
    </div>
</div>

<footer class="footer">
    <div class="row">
        <p class="pull-left">&copy; My Company <?= date('Y') ?></p>

        <p class="pull-right"><?= Yii::powered() ?></p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
