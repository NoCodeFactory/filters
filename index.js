let myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json")
let requestOptions = {
    method: "get",
    headers: myHeaders,
    redirect: "follow",
}

let tab = "test4"

let datas
let filteredData = []

const cardContainer = document.querySelector('.card_container')
let card = document.querySelector('.card')

let allFilters = {
    arrayTownFilter: [],
    arrayBackgroundFilter: ["Reset"]
}

const townFilters = document.querySelector('.town_filter')
const backgroundFilter = document.querySelector('.background_filter')

const checkboxTemplate = document.querySelector('.checkbox_template')

const radioTemplate = document.querySelector('.radio_template')

const loader = document.querySelector('.loader')
let isLoading = true

const loading = () => {
    if(isLoading == true) {
        loader.classList.remove('d-none')
    } else {
        loader.classList.add('d-none')
    }
}
loading()

let creatingElements = (arrayData) => {
    containerIsClear = false

    if(cardContainer.children.length > 0) {
        while(cardContainer.children.length > 0) {
            cardContainer.removeChild(cardContainer.firstChild)
        }
        containerIsClear = true
    } else {
        containerIsClear = true
    }

    for(i = 0; i < arrayData.length; i++) {
        let cardCloned = card.cloneNode(true)
        cardCloned.classList.add("cardCloned")

        cardContainer.appendChild(cardCloned)
    }

    card.remove()

    let cardCloned = document.querySelectorAll('.cardCloned')
    let cardImage = document.querySelectorAll(".card_image")
    let cardTitle = document.querySelectorAll(".card_title")
    let cardDescription = document.querySelectorAll(".card_description")
    let cardDate = document.querySelectorAll(".card_date")
    let cardTag = document.querySelectorAll(".card_tag")

    arrayData.forEach((element, key) => {

        cardCloned[key].href = `/microview?id=${element.record_id}`
        cardCloned[key].style.backgroundColor = element.backgroundColor
        cardImage[key].src = element.image
        cardTitle[key].textContent = element.titre
        cardDescription[key].textContent = element.description
        cardDate[key].textContent = element.date
        cardTag[key].textContent = element.tag
    })
}

let filterSelected = []
let radioFilter = []
let noRadioFilter = false
let activeFilter = (globalData, filteredData, _filter, _template, filterCloned, _filterType) => {
    filterCloned.forEach(element => {
        element.addEventListener('click', (e) => {

            e.preventDefault()
            if(element.children[0].checked == true && _filterType == "checkbox") {
                element.children[0].checked = false
                filterSelected = []
                Object.values(filterCloned).filter(element => {
                    if(element.children[0].checked == true) {
                        filterSelected.push(element.children[1].textContent)
                    }
                })
            } else {
                element.children[0].checked = true
                if (!filterSelected.find(filter => filter == element.children[1].textContent)){
                    filterSelected.push(element.children[1].textContent)
                } else {
                    filterSelected = []
                }
            }

            if(_filterType == "checkbox") {
                if(filteredData.length == 0) {
                    globalData.some(data => {
                        if(filterSelected.find(element => element.includes(data[_filter]))) {
                            filteredData.push(data)
                        }
                    })
                } else {
                    if(element.children[0].checked == true) {
                        globalData.some(data => {
                            if(filterSelected.find(element => element.includes(data[_filter])) && !filteredData.find(element => element == data)) {
                                filteredData.push(data)
                            }
                        })
                    } else {
                        globalData.some(data => {
                            if(!filterSelected.find(element => element.includes(data[_filter]))) {
                                let index = filteredData.indexOf(data)
                                if(index > -1) {
                                    filteredData.splice(index, 1)
                                }
                            }
                        })
                    }
                }
            } else {
                if(element.children[1].textContent == "Reset") {
                    radioFilter = []
                    noRadioFilter = false
                } else {
                    if(filteredData.length == 0) {
                        globalData.some(data => {
                            if(filterSelected.find(element => element.includes(data[_filter]))) {
                                filteredData.push(data)
                            }
                        })
                    } else {
                        radioFilter = []
                        filterSelected = []
                        filterCloned.forEach(element => {
                            if(element.children[0].checked == true) {
                                filterSelected.push(element.children[1].textContent)
                            }
                        })
                        filteredData.some(data => {
                            if(filterSelected.find(element => element.includes(data[_filter]))) {
                                radioFilter.push(data)
                            } else {
                                noRadioFilter = true
                            }
                        })
                    }
                }
            }

            if(filteredData.length > 0 && noRadioFilter == false) {
                if(filterSelected.length > 0) {
                    creatingElements(filteredData)
                } else {
                    creatingElements(globalData)
                }
            } else if(radioFilter.length > 0 || noRadioFilter == true) {
                creatingElements(radioFilter)
            } else {
                creatingElements(globalData)
            }
        })
    })
}

let generationFilter = (globalData, _filterArray, _template, _filter, _filterContainer, _filterType) => {
    
    globalData.forEach(datas => {
        if(_filterArray.length == 0) {
            _filterArray.push(datas[_filter])
        } else {
            if(!_filterArray.find(element => element == datas[_filter])) {
                _filterArray.push(datas[_filter])
            }
        }
    })

    if(_filterType != "select") {
        for(i = 0; i < _filterArray.length; i++) {
            let filterClone = _template.cloneNode(true)
            filterClone.classList.add(`${_filter}Cloned`)
    
            _filterContainer.appendChild(filterClone)
        }
    
        _template.remove()
    }

    let filterCloned = document.querySelectorAll(`.${_filter}Cloned`)
    
    switch(_filterType) {
        case "checkbox":
            filterCloned.forEach((element, key) => {
                element.children[1].textContent = _filterArray[key]
            })
            break;

        case "radio":
            filterCloned.forEach((element, key) => {
                element.children[0].value = _filterArray[key]
                element.children[1].textContent = _filterArray[key]
            })
            break;

        case "select":
            let clear = false
            if(clear == false) {
                while(_template.children.length > 0) {
                    _template.removeChild(_template.firstChild)
                }
                clear = true
            }
            let resetOpt = document.createElement('option')
            resetOpt.value = "Reset"
            resetOpt.innerHTML = "Reset"
            _template.add(resetOpt)
            _filterArray.forEach(element => {
                let opt = document.createElement('option')
                opt.value = element
                opt.innerHTML = element
                _template.add(opt)
            })
            break;
    }
    activeFilter(globalData, filteredData, _filter, _template, filterCloned, _filterType)
}

fetch(`https://v1.nocodeapi.com/ncfnicolas/google_sheets/LyttnfRysyNvHeEr?tabId=${tab}`, requestOptions)
    .then(response => response.text())
    .then(result => {
        let parsedData = JSON.parse(result).data
        datas = parsedData

        creatingElements(parsedData)

        generationFilter(parsedData, allFilters.arrayTownFilter, checkboxTemplate, "Ville", townFilters, "checkbox")

        generationFilter(parsedData, allFilters.arrayBackgroundFilter, radioTemplate, "backgroundColor", backgroundFilter, "radio")

        isLoading = false;
        loading()

        })
        .catch(error => console.log('error', error))
