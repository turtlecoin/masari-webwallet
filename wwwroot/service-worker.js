"use strict";
/*
 * Copyright (c) 2018, Gnock
 * Copyright (c) 2018, The Masari Project
 * Copyright (c) 2018, The TurtleCoin Project
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
workbox.precaching.precacheAndRoute([
  {
    "url": "api.html",
    "revision": "4910c7ff5a35c07340d736ffc52783f7"
  },
  {
    "url": "api.js",
    "revision": "7922cddbed39f4fdff6940244ef66678"
  },
  {
    "url": "assets/css/font-awesome.css",
    "revision": "4bb3dd721c4652feee0953261d329710"
  },
  {
    "url": "assets/css/font-awesome.min.css",
    "revision": "a0e784c4ca94c271b0338dfb02055be6"
  },
  {
    "url": "assets/css/main.css",
    "revision": "d8421c58122f5c899a3f49ca4e81be01"
  },
  {
    "url": "assets/img/binary-background.jpg",
    "revision": "9950b9f8a4133456595e5e9a2bc3f7e8"
  },
  {
    "url": "assets/img/favicon.ico",
    "revision": "5be8403028787cb82568f383d600345b"
  },
  {
    "url": "assets/img/icons/icon-128x128.png",
    "revision": "e811e677a13d26ebef437640e1bb7d30"
  },
  {
    "url": "assets/img/icons/icon-144x144.png",
    "revision": "acc05fbd2d5578b078dded25d19e731d"
  },
  {
    "url": "assets/img/icons/icon-152x152.png",
    "revision": "a4f5659dda1cfe7aba3fb84104a563c5"
  },
  {
    "url": "assets/img/icons/icon-192x192.png",
    "revision": "78dfb4755afb8642a9c43147ccb1cd08"
  },
  {
    "url": "assets/img/icons/icon-256x256.png",
    "revision": "ae887fc3850ec2b3cdb71d5a97b318be"
  },
  {
    "url": "assets/img/icons/icon-402x402.png",
    "revision": "3f37d9ffeb2d1e492a6b6d6d9e90d5bc"
  },
  {
    "url": "assets/img/landing/75-usersthink-stock-image.jpg",
    "revision": "7a00bbf57aacc5303e846055b6dae1cb"
  },
  {
    "url": "assets/img/landing/landing.jpg",
    "revision": "4cb142424f52853c4d95d455b6c07ff1"
  },
  {
    "url": "assets/img/logo_white.png",
    "revision": "7bd09464222eb86e59b02d9b46289a61"
  },
  {
    "url": "assets/img/logo.png",
    "revision": "c63a3f6d4ffea25b8cb47caa6225d99b"
  },
  {
    "url": "assets/img/logoQrCode.jpg",
    "revision": "b6feaeb51d4ecc8106aad5f2432a425f"
  },
  {
    "url": "assets/img/logoQrCode.png",
    "revision": "809ef9b99f138de582ef491d70e58570"
  },
  {
    "url": "assets/img/qrlogo.png",
    "revision": "db39ba5d33977cf5ba276ee6dfaa4f9b"
  },
  {
    "url": "assets/img/Turtle_Vertical.png",
    "revision": "834a2875a32d944ce571be84645651d7"
  },
  {
    "url": "assets/img/turtlehex.png",
    "revision": "dacb87b45092105b8380fbed2e8f4886"
  },
  {
    "url": "config.js",
    "revision": "4a6024c4d79e6da6b57f8f98f60410cb"
  },
  {
    "url": "d/vue-i118n.js",
    "revision": "85fd5089c3278f8f544a3691fd38f49b"
  },
  {
    "url": "filters/Filters.js",
    "revision": "6d7428b88b10d0e3fb8e7e021aaa72fe"
  },
  {
    "url": "index.html",
    "revision": "1275fbc5ed36340a2b0dd63d0a79bf20"
  },
  {
    "url": "index.js",
    "revision": "fcbeaa008883829839eaee2d513ffeb2"
  },
  {
    "url": "lib/base58.js",
    "revision": "cad61541b48010d7e792f394567995a7"
  },
  {
    "url": "lib/biginteger.js",
    "revision": "530a07476fdc1ca4e90f0696dde85709"
  },
  {
    "url": "lib/cn_utils_native.js",
    "revision": "5572be83d7239ee2a8c1161fe7140303"
  },
  {
    "url": "lib/cn_utils.js",
    "revision": "a7ed4f18b6258fa0df4fe65e54eb1532"
  },
  {
    "url": "lib/crypto.js",
    "revision": "94a47d1cad1e87e779eb29e21225f1e4"
  },
  {
    "url": "lib/decoder.min.js",
    "revision": "87eac23b87a1b14b80563b5fe775bc17"
  },
  {
    "url": "lib/FileSaver.min.js",
    "revision": "d2e0d52146931b50ded6b4a8cadb6f8f"
  },
  {
    "url": "lib/jquery-3.2.1.min.js",
    "revision": "473957cfb255a781b42cb2af51d54a3b"
  },
  {
    "url": "lib/jspdf.min.js",
    "revision": "bcc6f9c8d3b58438d8e8aa24314b41f9"
  },
  {
    "url": "lib/kjua-0.1.1.min.js",
    "revision": "f0ea94e8c4cbc705eaaf8b6cede15389"
  },
  {
    "url": "lib/mnemonic.js",
    "revision": "f81f584bb025513e9544900b0e9d0c31"
  },
  {
    "url": "lib/nacl-fast-cn.js",
    "revision": "5a4c4d33ad852ae5cce33dcc2c3d29a3"
  },
  {
    "url": "lib/nacl-fast.js",
    "revision": "7458a6b3018e57a4ab4ca81a6dd26dd2"
  },
  {
    "url": "lib/nacl-fast.min.js",
    "revision": "4e5450d2e030eed0c1b96cccd68ab8db"
  },
  {
    "url": "lib/nacl-util.min.js",
    "revision": "c7b843b9e9b5aad102c855c600c7edc8"
  },
  {
    "url": "lib/nacl.js",
    "revision": "43f0590d1bd0d155c37168eef6375e14"
  },
  {
    "url": "lib/nacl.min.js",
    "revision": "d8eaf281c8890a60ebe82840456edc33"
  },
  {
    "url": "lib/numbersLab/Context.js",
    "revision": "ebb2aae3a749741226613dd291cc2839"
  },
  {
    "url": "lib/numbersLab/DependencyInjector.js",
    "revision": "8a6c8d1278777297fdb87c901839ea6b"
  },
  {
    "url": "lib/numbersLab/DestructableView.js",
    "revision": "130f58a50d4641ce84928ccbacf1a965"
  },
  {
    "url": "lib/numbersLab/Logger.js",
    "revision": "de9da3f513d18d131cbe7fd783105cd5"
  },
  {
    "url": "lib/numbersLab/Observable.js",
    "revision": "d3bede42dfc41a78b4d50647bdb74646"
  },
  {
    "url": "lib/numbersLab/Router.js",
    "revision": "1af955cddf8e600fcf6f26d56dda354e"
  },
  {
    "url": "lib/numbersLab/VueAnnotate.js",
    "revision": "503a173798ba5bfb0598061b62864920"
  },
  {
    "url": "lib/require.js",
    "revision": "5b08692433e727db32f63db348f4837b"
  },
  {
    "url": "lib/sha3.js",
    "revision": "c38274b1eab5b932269f17bb9cc759b0"
  },
  {
    "url": "lib/sweetalert2.js",
    "revision": "59eb5df1a27b4ba7d10b4ce3e3749f30"
  },
  {
    "url": "lib/vue-i18n.js",
    "revision": "fe8f6691b4ed710c1cb85182ab223a3f"
  },
  {
    "url": "lib/vue.min.js",
    "revision": "3e7fd9458a2147045ce499aa4ccc27f6"
  },
  {
    "url": "localforage.js",
    "revision": "371744264096fd11aac649ce9442fb11"
  },
  {
    "url": "manifest.json",
    "revision": "e1e635959e26744df1c7cd7798ced21c"
  },
  {
    "url": "model/AppState.js",
    "revision": "ea45b0da3b465f8f1fb3e710c3ce04d4"
  },
  {
    "url": "model/blockchain/BlockchainExplorer.js",
    "revision": "1e4af976b6d6aa6cf70f10128286a74b"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRpc2.js",
    "revision": "ece7c588eacdeff994481586c2a48b9c"
  },
  {
    "url": "model/CnUtilNative.js",
    "revision": "482400b6e1f75d0c56567de509e22ad7"
  },
  {
    "url": "model/CoinUri.js",
    "revision": "4a78869a0ed9624f9eeeb970e5d71411"
  },
  {
    "url": "model/Constants.js",
    "revision": "e74ab6137435f26ee81f3a9b9d0bd969"
  },
  {
    "url": "model/CryptoUtils.js",
    "revision": "2be20a5511446b7b1cb530a735ee0a76"
  },
  {
    "url": "model/KeysRepository.js",
    "revision": "d707861003a4e8b07be478e97b860499"
  },
  {
    "url": "model/MathUtil.js",
    "revision": "c9190c6448b647e98e94b22f1defb045"
  },
  {
    "url": "model/Mnemonic.js",
    "revision": "f786c0bd45ab4f89a21fefa562205542"
  },
  {
    "url": "model/MnemonicLang.js",
    "revision": "b4130e59181668d077b78483112a847e"
  },
  {
    "url": "model/Nfc.js",
    "revision": "7e399a97da4ef764b528401d84951474"
  },
  {
    "url": "model/Password.js",
    "revision": "75359a651984e955eced1aa3a17c17dd"
  },
  {
    "url": "model/QRReader.js",
    "revision": "3d5e3ff96b539b5abb7f0b5ab92c5393"
  },
  {
    "url": "model/Storage.js",
    "revision": "719c5c31354ddfd4ee1d5c7a7e3b234d"
  },
  {
    "url": "model/Transaction.js",
    "revision": "56e8dde91737ed9330828eaa4cff04b3"
  },
  {
    "url": "model/TransactionsExplorer.js",
    "revision": "29d32d6f0519baafb31f0fc5c1b19afe"
  },
  {
    "url": "model/Translations.js",
    "revision": "f9c168a63d23b4e18e998b44f04889bd"
  },
  {
    "url": "model/Wallet.js",
    "revision": "dfe5a064c91e2e8e0b6e6adc4bdf1dd7"
  },
  {
    "url": "model/WalletRepository.js",
    "revision": "a6852f81290ada3dd1e55d1cef7eea6a"
  },
  {
    "url": "pages/account.html",
    "revision": "fe7e2ef0dc10795068bf86580de2a243"
  },
  {
    "url": "pages/account.js",
    "revision": "589b9875efed41f7bcaa68d901fa6022"
  },
  {
    "url": "pages/changeWalletPassword.html",
    "revision": "6961bb048cd0617399ee0d7b186bf3b1"
  },
  {
    "url": "pages/changeWalletPassword.js",
    "revision": "d663db521e6190c5d99f0018fe6f82db"
  },
  {
    "url": "pages/createWallet.html",
    "revision": "05d0f9cd2ba0e81180a5af7cc6173354"
  },
  {
    "url": "pages/createWallet.js",
    "revision": "7d1dd645f8194ca17ba19817940f717b"
  },
  {
    "url": "pages/disconnect.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "pages/disconnect.js",
    "revision": "e03c1d7e4d2883c7603c7b7ef4cafafc"
  },
  {
    "url": "pages/donate.html",
    "revision": "db6bc1afc2d6414c2ceff25dfb68705a"
  },
  {
    "url": "pages/donate.js",
    "revision": "516f75990e919901bac57e1efd8c02e6"
  },
  {
    "url": "pages/export.html",
    "revision": "d9aebbd4a53af878f4ef2743c1d34181"
  },
  {
    "url": "pages/export.js",
    "revision": "8daab46917c6a9c9dbbdd3e39b09519c"
  },
  {
    "url": "pages/import.html",
    "revision": "399e9714c496ee92076c8055f470d816"
  },
  {
    "url": "pages/import.js",
    "revision": "d356d24c1a242e78895c2dd386971af8"
  },
  {
    "url": "pages/importFromFile.html",
    "revision": "e78206b3a5d2f17cbaf857126778545d"
  },
  {
    "url": "pages/importFromFile.js",
    "revision": "56ddb73d8cd23683a830358b55397c48"
  },
  {
    "url": "pages/importFromKeys.html",
    "revision": "66ba3b1306fee8b98c735fb5e0277800"
  },
  {
    "url": "pages/importFromKeys.js",
    "revision": "2d3b0f69a785970f7262b97ed0307389"
  },
  {
    "url": "pages/importFromMnemonic.html",
    "revision": "9dd02c89b9dd07c3b0e69a18df1b8236"
  },
  {
    "url": "pages/importFromMnemonic.js",
    "revision": "7e198f5740d747ca54650e2460a220f2"
  },
  {
    "url": "pages/importFromQr.html",
    "revision": "d066f402ce1243383d024820920704b0"
  },
  {
    "url": "pages/importFromQr.js",
    "revision": "4b668f73571b38007da8e8ac155a3c06"
  },
  {
    "url": "pages/index.html",
    "revision": "0637b70346d3754a1776be824317c135"
  },
  {
    "url": "pages/index.js",
    "revision": "9e797c9a23f36626c5f22b911f49f7a9"
  },
  {
    "url": "pages/mining.html",
    "revision": "3a64dff05556dcb7d808ad5e66c24200"
  },
  {
    "url": "pages/mining.js",
    "revision": "7875c6608da6ddfb24451da810c62693"
  },
  {
    "url": "pages/network.html",
    "revision": "1839dc6567adf425e29c66ba5a5b0d13"
  },
  {
    "url": "pages/network.js",
    "revision": "26b98ab9e61089228add61b725e0694d"
  },
  {
    "url": "pages/receive.html",
    "revision": "f2f69df6e47d5e4c20fd20cd053e3e44"
  },
  {
    "url": "pages/receive.js",
    "revision": "eb052817dd69f5faaeb9671bdca8143d"
  },
  {
    "url": "pages/send.html",
    "revision": "9354a4203b267a1251e123ec42ff6fcf"
  },
  {
    "url": "pages/send.js",
    "revision": "b1e347e100738354b934380d42d93183"
  },
  {
    "url": "pages/settings.html",
    "revision": "029b729cf33d5a9c9cb9b0d8b5a94719"
  },
  {
    "url": "pages/settings.js",
    "revision": "5c098c635e648b218af1a4ef020a855d"
  },
  {
    "url": "pages/support.html",
    "revision": "59281c7d1d7f2f76f2291c0f9995e5c7"
  },
  {
    "url": "pages/support.js",
    "revision": "f8135fd2b9c7f8744750ae6520c0fabf"
  },
  {
    "url": "pages/termsOfUse.html",
    "revision": "50a4fe5d19282d07fe3a07640f638838"
  },
  {
    "url": "pages/termsOfUse.js",
    "revision": "db3af3ca3c81ead32a62ac01c84a1608"
  },
  {
    "url": "providers/BlockchainExplorerProvider.js",
    "revision": "d3b2688faa42b1475770bccccc3d746c"
  },
  {
    "url": "service-worker-raw.js",
    "revision": "489b7b56cde20afcc8be4e9d20152cd3"
  },
  {
    "url": "translations/de.json",
    "revision": "37cb688e26c3df43dd738d3b396f186d"
  },
  {
    "url": "translations/en.json",
    "revision": "da898e9727e3d5aeef8acae200970d0d"
  },
  {
    "url": "translations/fr.json",
    "revision": "30ce99e9db0bb2ff7b66b28f5cf10215"
  },
  {
    "url": "translations/hu.json",
    "revision": "30fff69cdb0858c809881fd3c81af951"
  },
  {
    "url": "translations/sr.json",
    "revision": "23cce5e6d36047944f29e7d0188f07d4"
  },
  {
    "url": "utils/Url.js",
    "revision": "1b1db040059c603a6ce6b1adbf95daf0"
  },
  {
    "url": "workers/TransferProcessing.js",
    "revision": "1a5c631d72c76fe415ff28bc89c5e912"
  },
  {
    "url": "workers/TransferProcessingEntrypoint.js",
    "revision": "ec2ef7dbfe74836cd5bd22eefe30ccf1"
  }
]);
self.addEventListener('message', function (event) {
    if (!event.data) {
        return;
    }
    switch (event.data) {
        case 'force-activate':
            self.skipWaiting();
            self.clients.claim();
            self.clients.matchAll().then(function (clients) {
                clients.forEach(function (client) { return client.postMessage('reload-window-update'); });
            });
            break;
        default:
            // NOOP
            break;
    }
});
