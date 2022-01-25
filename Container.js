const fs = require ('fs');

/* Schema
        product ={
            title:String (required),
            price:Number (required),
            thumbnail: String
        }
*/

const pathToProducts = './files/products.txt'

class container{
    constructor(filename){
        this.filename=filename
    }
    saveProduct = async (product) =>{
        if(!product.title||!product.price) return {status:"error", error: "missing data"}
        try{
            if(fs.existsSync(pathToProducts)){
                let data = await fs.promises.readFile(pathToProducts, 'utf-8')
                let products = JSON.parse(data);
                if (products.length === 0){
                    product.id = 1;
                }else{
                    let id = products[products.length-1].id+1;
                    product.id = id;
                }
                products.push(product);
                await fs.promises.writeFile(pathToProducts,JSON.stringify(products,null,2))
                return {status:"success",message:"Product inserted"}
            }else{
                product.id = 1
                await fs.promises.writeFile(pathToProducts,JSON.stringify([product],null,2))
                return {status:"success",message:"Product inserted"}
            }   
        }catch(error){
            return {status: "error",message:error}
        }
    }
    getall = async () => {
        if(fs.existsSync(pathToProducts)){
            let data = await fs.promises.readFile(pathToProducts, 'utf-8')
            let products = JSON.parse(data);
            return {status: "success", productList:products}
        }
    }
    getById = async (id) => {
        if(!id) return {status:"error", error:"Missing Id"};
        if(fs.existsSync(pathToProducts)){
            let data = await fs.promises.readFile(pathToProducts, 'utf-8')
            let products = JSON.parse(data);
            let product = products.find(p =>p.id===id);
            if (product) return {status:"success", productList:product} 
            else return {status:"error", error:"Product not found"}
        }
    }
    deleteById = async (id) =>{
        if(!id) return {status:"error", error:"Missing Id"};
        if(fs.existsSync(pathToProducts)){
            let data = await fs.promises.readFile(pathToProducts, 'utf-8')
            let products = JSON.parse(data);
            let newProducts = products.filter(p =>p.id!==id)
            await fs.promises.writeFile(pathToProducts,JSON.stringify(newProducts,null,2))
            return {status: "success", message:"Product deleted"}
        }
    }
    deleteAll = async () => {
        if(fs.existsSync(pathToProducts)){
            let data = await fs.promises.readFile(pathToProducts, 'utf-8')
            let products = JSON.parse(data);
            let emptyList = products
            emptyList.splice(0, products.length); 
            await fs.promises.writeFile(pathToProducts,JSON.stringify(emptyList,null,2)) 
            return {status: "success", message:"List deleted"}      
        }

    }
}

module.exports = container;