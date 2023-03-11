# citizen-front
## Развертывание
Нужно выполнить следующие действия:
1. npm i
2. gulp
## Работа с основным пользователем
Для работы используем обьект user:
```
 const mainUser = user.__constr(
   {
     tgName: "sanek",
     name: "sanek2",
     surname: "surn",
     birth: "1 april 1955",
     points: 5,
     thanks: 27,
     token: "fg3ldggdfgdgdfgljdb",
     balance: 15.64824786,
     dateReg: "24.01.2023",
     userImg: 'https:avatars.mds.yandex.net/get-altay/6145018/2a00000182f82cb5e24152761631320b53e7/XXXL',
     gender: 'male',
     tgId: ''
   },
   [
     [
       "Character",
       {
         "Well-mannered Character": [5, 5, 5],
         "Punctual Character": [500, 500, 500],
       }
     ],
     [
       "Vices",
       {
         "Well-mannered Vices": [5, 5, 5],
         "Punctual Vices": [500, 500, 500],
       }
     ],
     [
       "Morality",
       {
         "Well-mannered Morality": [5, 5, 5],
         "Punctual Morality": [500, 500, 500],
       }
     ],
     [
       "Attitude",
       {
         "Well-mannered Attitude": [5, 5, 5],
         "Punctual Attitude": [500, 500, 500],
         "Punctual 2 Attitude": [500, 500, 500],
       }
     ],
     [
       "Emotions",
       {
         "Well-mannered Emotions": [5, 5, 5],
         "Punctual Emotions": [500, 500, 500],
       }
     ],
     [
       "Skills",
       {
         "Well-mannered Skills": [50, 50, 50],
         "Punctual Skills": [250, 250, 250],
       }
     ],
   ]
 );
 mainUser.render(); каждый новый рендер перерисовывает все поля
```

## Работа с другими пользователями

```
 otherUsers.__constr([
   {
     tgName: "1",
     socialRole: {
       name: "son",
       count: 0,
     },
     token: 'copyToken',
     userImg: 'https:siteclinic.ru/wp-content/uploads/2015/12/obman_polzovateley.png',
     UserParams: [  параметры пользователя
       [
         "Character",
         {
           "Well-mannered Character": [5, 5, 5],
           "Punctual Character": [500, 500, 500],
         }
       ],
       [
         "Vices",
         {
           "Well-mannered Vices": [5, 5, 5],
           "Punctual Vices": [500, 500, 500],
         }
       ],
       [
         "Morality",
         {
           "Well-mannered Morality": [5, 5, 5],
           "Punctual Morality": [500, 500, 500],
         }
       ],
       [
         "Attitude",
         {
           "Well-mannered Attitude": [5, 5, 5],
           "Punctual Attitude": [500, 500, 500],
           "Punctual 2 Attitude": [500, 500, 500],
         }
       ],
       [
         "Emotions",
         {
           "Well-mannered Emotions": [5, 5, 5],
           "Punctual Emotions": [500, 500, 500],
         }
       ],
       [
         "Skills",
         {
           "Well-mannered Skills": [50, 50, 50],
           "Punctual Skills": [250, 250, 250],
         }
       ],
     ],
   },
   {
     tgName: "tgg",
     userImg: 'https:stickerbase.ru/wp-content/uploads/2020/10/51557-300x300.png',
     socialRole: {
       name: "son2",
       count: 2,
     },
   },
 ]);
 otherUsers.render();  каждый новый рендер перерисовывает всех пользователей
 ```
## Работа с списками
для того чтобы пользователю отображать списки в инпутах необходимо передать: название, массив значений, тип поля.
Пример:
```
 const userAllParams = [
     [
       "Character",
     ["Well-mannered Character",
       "Well-mannered Character1",
       "Well-mannered Character2"
     ],
       'select' //только из списка
     ],
     [
       "Vices",
       ["Well-mannered Vices"],
       'select' //только из списка
     ],
     [
       "Morality",
       ["Well-mannered Morality"],
       'select' //только из списка
     ],
     [
       "Attitude",
       ["Well-mannered Attitude"],
       'select' //только из списка
     ],
     [
       "Emotions",
       ["Well-mannered Emotions"],
       'select' //только из списка
     ],
     [
       "Skills",
       ["Well-mannered Skills"],
       'input' // любое значение
     ],
 ];
  
 userAllParams.forEach((elm) => {
   userListParams.__constr(elm[0], elm[1], elm[2]).render();
 });
```

## triggers:
-- infoLoad {mainUser} - обработка пользователя(проверка прав)
