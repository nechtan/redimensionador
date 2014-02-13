var im = require('imagemagick-native');
var fs = require('fs');
var pasta = './imagens';
var path = require('path');
var express = require('express');
var app = express();

app.get('/imagem/:largura/:altura/:arquivo', function(req, res, next){

    // Lê o arquivo na pasta configurada a partir do nome
    // passado pela url
    fs.readFile(path.join(pasta, req.params.arquivo), function(err, buffer){

        // Deixa o express lidar com os erros se existir
        if(err)
            return next(err);

        // Faz a conversão do buffer recebido
        // com as configurações especificadas aqui
        var img = im.convert({
           srcData : buffer,
           width : req.params.largura,
           height : req.params.altura,
           resizeStyle : 'aspectfill',
           quality : 100,
           format : 'JPEG'
        });

        // Seta a header para o navegador exibir como uma
        // imagem e logo após envia
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(img);
    });

});

// Iniciando a aplicação na porta 8080
// agora é só acessar a rota :)
app.listen(8080);
