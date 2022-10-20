import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'gray']
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `/cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// Patterns dos inputs do cartão de crédito //

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), // Retornando os 2 últimos dígitos do ano atual (2022) = 22
      to: String(new Date().getFullYear() + 10).slice(2) // Retornando os 2 últimos dígitos do ano atual e somando 10 = 32
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, // A expressão começa com 4 seguido de mais 15 dígitos de 0 a 9
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))

    return foundMask
  },
}

/* 
  regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/

  ^5[1-5]\d{0,2}: começa com 5 seguido de um dígito de 1 a 5, seguido de mais 2 dígitos
    OUinput id="card-number" />
  ^22[2-9]\d: começa com 22 seguido de um dígito de 2 a 9, seguido de mais um dígito
    OU
  ^2[3-7]\d{0,2}: começa com 2 seguido de um dígito de 3-7, seguido de mais 2 dígitos

  \d{0,12}: contém mais 12 dígitos

  ^ : começa com
  | : OU
*/

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)



// ****Eventos do cartão de crédito****

/* 
  addEventListener fica "escutando" uma ação do usuário, e quando acontece uma função é diparada.
  Como por exemplo no código abaixo, quando o botão é clicado dispara a função e mostra um alerta na página informando que o cartão foi adicionado

    addButton.addEventListener('click', () => {
      alert("Cartão adicionado!")
    })

  E nesse outro exemplo temos um evento 'input', toda vez que o usuário interage com o input a função é disparada.
  Trocando o valor da div de classe .value, pelo valor digitado no input com o innerText

    addEventListener('input', () => {
      const ccHolder = document.querySelector(".cc-holder .value")

      ccHolder.innerText = cardHolder.value
    })
*/

const addButton = document.querySelector("#add-card")
addButton.addEventListener('click', () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "NOME COMO ESCRITO NO CARTÃO" : cardHolder.value
  /* 
    Se o valor/tamanho de cardHolder (input) for igual a zero, no cartão ficará escrito
    "NOME COMO ESCRITO NO CARTÃO", se for maior que zero aparecerá o valor digitado no
    input
  */
})

// ****Capturando eventos usando o IMask****

securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}


expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(expiration) {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")

  ccExpirationDate.innerText = expiration
}


cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype // Atribuindo o tipo de cartão para a variável cardType
  setCardType(cardType) // Usando a função para mudar o layout do cartão de acordo com a bandeira
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
}