class ProductsApi {
    constructor() {
        this.elements = [{
            title: "Hamburguesa",
            price: "840",
            thumbnail: "https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
            id: 1
        },
        {
            title: "6 tequeños medianos",
            price: "600",
            thumbnail: "https://directoalchoso.com/wp-content/uploads/2021/09/RFB-0000-30-tequen%CC%83os.jpg",
            id: 2
        }
    ]
        this.id = 2
    }

    show(id) {
        const elem = this.elements.find(elem => elem.id == id)
        return elem || { error: `elemento no encontrado` }
    }

    showAll() {
        return [...this.elements]
    }

    save(elem) {
        const newElem = { ...elem, id: ++this.id }
        this.elements.push(newElem)
        return newElem
    }

    update(elem, id) {
        const newElem = { id: Number(id), ...elem }
        const index = this.elements.findIndex(p => p.id == id)
        if (index !== -1) {
            this.elements[index] = newElem
            return newElem
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    delete(id) {
        const index = this.elements.findIndex(elem => elem.id == id)
        if (index !== -1) {
            return this.elements.splice(index, 1)
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    deleteAll() {
        this.elements = []
    }
}

module.exports = ProductsApi
