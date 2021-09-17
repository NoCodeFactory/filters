let myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json")
let requestOptions = {
    method: "get",
    headers: myHeaders,
    redirect: "follow",
}

let tab = "test4"

// Initializing a global variable for datas
let datas
let filteredData = []

// Setting card template & card container
const cardContainer = document.querySelector('.card_container')
let card = document.querySelector('.card')

let allFilters = {
    arrayTownFilter: ["Reset"],
    arrayBackgroundFilter: ["Reset"]
}
let filterIsSelected = false

// Container for filters
const townFilters = document.querySelector('.town_filter')
const backgroundFilter = document.querySelector('.background_filter')

// Variables for checkbox
const checkboxTemplate = document.querySelector('.checkbox_template')

// Variables for radio option
const radioTemplate = document.querySelector('.radio_template')

// Loader animation
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

// Function to create elements
let creatingElements = (arrayData) => {
    containerIsClear = false

    // Deleting if cardContainer already have children
    if(cardContainer.children.length > 0) {
        while(cardContainer.children.length > 0) {
            cardContainer.removeChild(cardContainer.firstChild)
        }
        containerIsClear = true
    } else {
        containerIsClear = true
    }

    // Creating the Clones
    for(i = 0; i < arrayData.length; i++) {
        // Cloning the card template
        let cardCloned = card.cloneNode(true)
        cardCloned.classList.add("cardCloned")

        // Puting the elements in the container
        cardContainer.appendChild(cardCloned)
    }

    // Deleting the template
    card.remove()

    // Selecting all the Clones
    let cardCloned = document.querySelectorAll('.cardCloned')
    let cardImage = document.querySelectorAll(".card_image")
    let cardTitle = document.querySelectorAll(".card_title")
    let cardDescription = document.querySelectorAll(".card_description")
    let cardDate = document.querySelectorAll(".card_date")
    let cardTag = document.querySelectorAll(".card_tag")

    arrayData.forEach((element, key) => {

        // Setting the datas for the card
        cardCloned[key].href = `/microview?id=${element.record_id}`
        cardCloned[key].style.backgroundColor = element.backgroundColor
        cardImage[key].src = element.image
        cardTitle[key].textContent = element.titre
        cardDescription[key].textContent = element.description
        cardDate[key].textContent = element.date
        cardTag[key].textContent = element.tag
    })
}

let activeFilter = (globalData, filteredData, _filter, _template, filterCloned, _filterType) => {
    if(_filterType != "select") {
        filterCloned.forEach(element => {
            element.addEventListener('click', () => {
                let filterSelected = []
                filterSelected.push(element.children[1].textContent)

                if(filteredData.length == 0) {
                    globalData.some(data => {
                        if(filterSelected.find(element => element == data[_filter])) {
                            filteredData.push(data)
                        }
                    })
                } else {
                    let emptyArray = []
                    filteredData.some(data => {
                        if(filterSelected.find(element => element == data[_filter])) {
                            emptyArray.push(data)
                        }
                    })
                    filteredData = emptyArray
                }
                
                if(filterSelected[0] == "Reset") {
                    filteredData = []
                    console.log(filteredData)
                    creatingElements(globalData)
                } else {
                    creatingElements(filteredData)
                }
                console.log(filteredData)
            })
        })
    } else {
        let selectValue = _template.value
        _template.addEventListener('click', () => {
            if(_template.value != selectValue) {
                let filterSelected = []
                console.log(filterSelected)
                
                if(filteredData.length > 0) {
                    filteredData = []
                }

                filterSelected.push(_template.value)
                
                if(filteredData.length == 0) {
                    globalData.some(data => {
                        if(filterSelected.find(element => element == data[_filter])) {
                            filteredData.push(data)
                        }
                    })
                } else {
                    let emptyArray = []
                    filteredData.some(data => {
                        if(filterSelected.find(element => element == data[_filter])) {
                            emptyArray.push(data)
                        }
                    })
                    filteredData = emptyArray
                }
                
                if(_template.value == "Reset") {
                    creatingElements(globalData)
                } else {
                    creatingElements(filteredData)
                }
                selectValue = _template.value
            }
        })
    }
}

let generationFilter = (globalData, _filterArray, _template, _filter, _filterContainer, _filterType) => {
    
    // Filter generation in a empty array
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
        // Creating the Clones
        for(i = 0; i < _filterArray.length; i++) {
            // Cloning the filter template
            let filterClone = _template.cloneNode(true)
            filterClone.classList.add(`${_filter}Cloned`)
    
            //Putting the elements in the container
            _filterContainer.appendChild(filterClone)
        }
    
        // Deleting the template
        _template.remove()
    }

    // Selecting all the Clones
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

// Fetching the datas and creating filters
fetch(`https://v1.nocodeapi.com/ncfnicolas/google_sheets/LyttnfRysyNvHeEr?tabId=${tab}`, requestOptions)
    .then(response => response.text())
    .then(result => {
        let parsedData = JSON.parse(result).data
        datas = parsedData

        creatingElements(parsedData)

        // Generating townFilter
        generationFilter(parsedData, allFilters.arrayTownFilter, checkboxTemplate, "Ville", townFilters, "checkbox")

        // Generating backgroundColorFilter
        generationFilter(parsedData, allFilters.arrayBackgroundFilter, radioTemplate, "backgroundColor", backgroundFilter, "radio")

        isLoading = false;
        loading()

        })
        .catch(error => console.log('error', error))
