//=========================================================================================================================

//БЛОК ИНТЕРАКТИВНЫХ ЭЛЕМЕНТОВ

//функция создания объекта - хранилища данных

function createStorage(userQuantity, objQuantity) {
  //создание обычных пользователей без прав
  const storage = {};
  for (let i = 1; i <= userQuantity; i++) {
    storage[`usr_${i}`] = {};
    let currentUser = storage[`usr_${i}`];
    for (let j = 1; j <= objQuantity; j++) {
      currentUser[`obj_${j}`] = { r: false, w: false, x: false, g: false };
    }
  }
  //создание суперпользователя со всеми правами
  storage[`admin`] = {};
  for (let x = 1; x <= objQuantity; x++) {
    storage[`admin`][`obj_${x}`] = { r: true, w: true, x: true, g: true };
  }
  return storage;
}

// объект - хранилище данных

const storage = createStorage(6, 5);

//генерация селектора юзеров как для админа, так и для выбранного пользователя

function createUserSelectorForAll(value) {
  const selector = document.createElement("select");

  //генерация селектора для пользователя
  if (value.toLowerCase() !== "admin") {
    selector.setAttribute("class", "selectUserForUsers");
    const filteredStorage = Object.keys(storage).filter(
      (el) => el !== "admin" && el !== `usr_${value.slice(-1)}`
    );
    createUserSelector(selector, filteredStorage);
  }

  //генерация селектора для админа
  else {
    selector.setAttribute("class", "selectUserForAdmin");
    const filteredStorage = Object.keys(storage).filter((el) => el !== "admin");
    createUserSelector(selector, filteredStorage);
  }
}

//функция общей генерации юзер селектора

function createUserSelector(selector, filteredStorage) {
  for (let el of filteredStorage) {
    let option = document.createElement("option");
    option.setAttribute("value", `${el}`);
    option.innerText = `Пользователь ${el.slice(-1)}`;
    selector.append(option);
  }
  document.querySelector(".selector_container").append(selector);
}

//генерация селектора объектов для выбранного пользователя и админа

function createObjSelectorForAll(value) {
  const selector = document.createElement("select");
  if (value.toLowerCase() !== "admin") {
    selector.setAttribute("class", "selectObjForUsers");
    createObjSelector(selector);
  } else {
    selector.setAttribute("class", "selectObjForAdmin");
    createObjSelector(selector);
  }
}

//общая генерация селектора объектов

function createObjSelector(selector) {
  const choseUser = Object.keys(storage)[0];
  for (el in storage[choseUser]) {
    let option = document.createElement("option");
    option.setAttribute("value", `${el}`);
    option.innerText = `Объект ${el.slice(-1)}`;
    selector.append(option);
  }
  document.querySelector(".selector_container").append(selector);
}

//генерация формы с чекбоксами

function createCheckboxesForAll(value) {
  const div = document.createElement("div");
  if (value.toLowerCase() !== "admin") {
    div.setAttribute("class", "selectRightsForUsers");
    createCheckBoxes(value, div);
  } else {
    div.setAttribute("class", "selectRightsForAdmin");
    createCheckBoxes(value, div);
  }
}

//общая генерация чекбоксов

function createCheckBoxes(value, div) {
  const user = storage[Object.keys(storage).filter((el) => el !== "admin")[0]];
  const object = user[Object.keys(user)[0]];
  forLoop: for (el in object) {
    if (el === "g") {
      if (value.toLowerCase() !== "admin") {
        continue forLoop;
      }
    }
    const input = document.createElement("input");
    const label = document.createElement("label");
    const br = document.createElement("br");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", `${el}`);
    input.setAttribute("value", `${el}`);
    label.htmlFor = `${el}`;
    label.innerText = `${el}`;
    div.append(input, label, br);
  }
  document.querySelector(".selector_container").append(div);
}

//генерация селекторов и чекбоксов

function createselectorContainer(value) {
  createUserSelectorForAll(value);
  createObjSelectorForAll(value);
  createCheckboxesForAll(value);
}

//=============================================================================================================================================================

//проброска слушателей на все интерактивные элементы до пользовательского рендера

const selectorContainer = document.querySelector(".selector_container");
const searchButton = document.querySelector(".searchButton");
const searchBar = document.querySelector(".searchBar");

//проброска слушателя на кнопку, подтверждающую поиск пользователя с последующим рендером

searchButton.addEventListener("click", () => {
  //очищаем контейнер от предыдущих элементов
  selectorContainer.innerHTML = "";

  if (searchBar.value.toLowerCase() == "админ") {
    createselectorContainer("admin");
    addEventListenersForAdmin();
    return;
  }

  if (searchBar.value.slice(0, 12).toLowerCase() == "пользователь") {
    if (`usr_${parseInt(searchBar.value.slice(13))}` in storage) {
      createselectorContainer(`usr_${parseInt(searchBar.value.slice(13))}`);
      const button = document.createElement("button");
      button.setAttribute("class", "userGiveRightsButton");
      button.innerText = "подтвердить";
      selectorContainer.append(button);
      addEventListenersForUser(button);
      return;
    } else {
      return alert("Вы ввели неверный номер пользователя");
    }
  } else {
    return alert("Вы ввели неверное имя пользователя");
  }
});

//функция, развешивающая слушатели на все генерируемые селекторы и чекбоксы админа

function addEventListenersForAdmin() {
  const userSelectorForAdmin = document.querySelector(".selectUserForAdmin");
  const objectSelectorForAdmin = document.querySelector(".selectObjForAdmin");
  const checkboxesForAdmin = document.querySelector(".selectRightsForAdmin");

  renderObjContainer(userSelectorForAdmin);
  renderCheckBoxes(userSelectorForAdmin, objectSelectorForAdmin);

  addEventListenerForAdminCheckboxes(
    checkboxesForAdmin,
    userSelectorForAdmin,
    objectSelectorForAdmin
  );
  addEventListenerForAdminObject(userSelectorForAdmin, objectSelectorForAdmin);
  addEventListenerForAdminContainer(
    userSelectorForAdmin,
    objectSelectorForAdmin
  );
}

//функция, развешивающая слушатели на все генерируемые селекторы и чекбоксы юзера

function addEventListenersForUser(button) {
  const userSelectorForUsers = document.querySelector(".selectUserForUsers");
  const objectSelectorForUsers = document.querySelector(".selectObjForUsers");
  const checkboxesForUsers = document.querySelector(".selectRightsForUsers");

  renderObjContainer(`usr_${parseInt(searchBar.value.slice(13))}`);
  addEventListenerForUser(
    button,
    `usr_${parseInt(searchBar.value.slice(13))}`,
    userSelectorForUsers,
    objectSelectorForUsers,
    checkboxesForUsers
  );
}

/*при изменении состояния чекбокса идёт добавление/удаление данных из хранилища 
соответствующего объекта в выбранном пользователе, а затем происходит повторный
рендер изменённого объекта*/

function addEventListenerForAdminCheckboxes(checkboxes, user, object) {
  checkboxes.querySelectorAll("input").forEach((el) => {
    el.addEventListener("change", () => {
      if (el.checked) {
        storage[user.value][object.value][el.value] = true;
        renderObj(user, object);
      } else {
        storage[user.value][object.value][el.value] = false;
        renderObj(user, object);
      }
    });
  });
}

/*при изменении объекта идёт повторный рендер всех объектов, а также
состояний чекбоксов*/
function addEventListenerForAdminContainer(user, object) {
  user.addEventListener("change", () => {
    renderObjContainer(user);
    renderCheckBoxes(user, object);
  });
}

/*при выборе другого объекта состояния чекбоксов изменяются
в соответствии с данными в хранилище об этом объекте*/
function addEventListenerForAdminObject(user, object) {
  object.addEventListener("change", () => {
    renderCheckBoxes(user, object);
  });
}

//функция, которая вешает слушатель на кнопку для передачи прав другому пользователю

function addEventListenerForUser(button, giver, reciver, object, checkboxes) {
  button.addEventListener("click", () => {
    giveUserrights(giver, reciver, object, checkboxes);
  });
}

//фунция перерисовки отдельного объекта

function renderObj(user, object) {
  const modifiedObjId = object.value;
  const modifiedObj = document.querySelector(
    `[data-obj-id = ${modifiedObjId}]`
  );
  let result = "";
  for (const [key, value] of Object.entries(
    storage[user.value][object.value]
  )) {
    if (value === true) {
      result += key;
    }
  }
  modifiedObj.innerHTML = result;
}

/*фунция изменения состояния всех чекбоксов в соответствии 
с данными об объекте в хранилище*/

function renderCheckBoxes(user, object) {
  const obj = storage[user.value][object.value];

  for (el in obj) {
    const checkbox = document.querySelector(`.${el}`);
    checkbox.checked = obj[el];
  }
}

//функция перерисовки всех объектов для выбранного пользователя

function renderObjContainer(user) {
  const objRender = storage[user.value] ?? storage[user];

  for (el in objRender) {
    let result = "";
    for (const [key, value] of Object.entries(objRender[el])) {
      if (value === true) {
        result += key;
      }
    }
    document.querySelector(`[data-obj-id = ${el}]`).innerHTML = result;
  }
}

// функция передачи прав от найденного пользователя выбранному

function giveUserrights(giver, reciver, object, checkboxes) {
  if (storage[giver][object.value]["g"] === true) {
    checkboxes.querySelectorAll("input").forEach((el) => {
      if (el.checked === true) {
        if (storage[giver][object.value][el.value]) {
          storage[reciver.value][object.value][el.value] = true;
        } else {
          alert(
            `Пользователь ${parseInt(giver.slice(4))} не имеет право "${
              el.value
            }" на объект ${parseInt(object.value.slice(4))}`
          );
          return;
        }
      }
    });
    return;
  } else {
    alert(
      `Пользователь ${parseInt(
        giver.slice(0, 4)
      )} не может передавать свои права`
    );
  }
}
