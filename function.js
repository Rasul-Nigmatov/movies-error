//function of querySelector 
const $ = (selector, node = document) => {
    return node.querySelector(selector);
}