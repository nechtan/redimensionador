Depois que muitas pessoas (eu, meu cachorro e minha Heineken) solicitaram uma
postagem sobre redimensionamento de imagens no Node.js, resolvi ceder à multidão
e aqui está.

### imagemagick-native

O [imagemagick-native][1] é um módulo nativo (C++ bitches) que faz bindings
com a interface original do [ImageMagick][2] tornando-o um módulo muito rápido
(muito mesmo, quando eu digo muito, não duvidem, pois é muito mesmo) para
a manipulação de imagens.

Um lado negativo deste módulo é que ele é síncrono, então uma imagem muito grande
ou quadrilhões de requisições para rediensionamento poderiam derrubar o seu
servidor. Mas sempre há uma solução que vamos ver mais a frente, talvez em outro
tópico, se os deuses da preguiça deixarem.

"Tiu do Cabaré, por que você não usa o módulo [imagemagick][3]?" Por que ele
só é uma interface para o binário do ImageMagick, e spawnar um processo até o PHP
sabe fazer.

### Instalação

Atenção: este módulo precisará de compilação, então certifique-se que você
possui todas as [libs instaladas][5] e que, de preferência, não esteja usando o
Windows. Depois é só digitar `npm install --save imagemagick-native` no seu
terminal, dentro da pasta do seu projeto.

### Such talk, much bla bla, wow

Vamos ao código, nada de complicado, você só precisa passar um buffer e os
parâmetros para o ImageMagick fazer a mágica ([badum tss][4]).

```javascript
// Vamos pegar todos os módulos que precisamos
var fs = require('fs');
var im = require('imagemagick-native');

// Vamos ler a imagem no disco, pegando todo o conteúdo dela.
// Sim eu to usando a API síncrona, to com preguiça.
var buffer = fs.readFileSync('./heineken.jpg');

// Agora é só converter :)
var img = im.convert({
   srcData : buffer, // passo o buffer que peguei anteriormente
   width : 100,      // a largura do resultado final
   height : req.altura, // a altura
   resizeStyle : 'aspectfill', // o método de redimensionamento
   quality : 100, // qualidade da Heineken é sempre 100%
   format : 'JPEG' // O formato de saída
});

// Pronto, agora a nossa variável img possui
// uma miniatura de Heineken, vamos salvá-la no disco.
fs.writeFileSync('./heineken-mini.jpg');

// TA DA!
```

Easy, nada mais fácil que converter uma imagem. Não está satisfeito? Que tal
criar um servidor HTTP que envia as imagens redimensionadas dinamicamente?

```javascript
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
```

Agora é só acessar `http://localhost/imagem/100/100/heineken.jpg` e ver a
mágica acontecer. Se você quer baixar o exemplo completo com ibagens e tudo mais,
pode clonar este [repositório][6] e brincar com ele.

### Conclusão

A Heineken até em miniatura fica bonita.

[1]: https://github.com/mash/node-imagemagick-native
[2]: http://www.imagemagick.org/script/magick++.php
[3]: https://www.npmjs.org/package/imagemagick
[4]: http://www.youtube.com/watch?v=6zXDo4dL7SU
[5]: https://github.com/mash/node-imagemagick-native#installation
[6]: https://github.com/cranic/redimensionador
