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

  ^5[1-5]\d{0,2}: começa com com 5 seguido de um dígito de 1 a 5, seguido de mais 2 dígitos
    OU
  ^22[2-9]\d: começa com 22 seguido de um dígito de 2 a 9, seguido de mais um dígito
    OU
  ^2[3-7]\d{0,2}: começa com 2 seguido de um dígito de 3-7, seguido de mais 2 dígitos

  \d{0,12}: contém mais 12 dígitos

  ^ : começa com
  | : OU
*/

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)