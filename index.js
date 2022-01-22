//MAIN BACKEND FILE 

const db=require("./database");
const mongoose = require('mongoose');
// console.log(db.books);
// console.log(db.authors);
// console.log(db.publications);

const express=require("express");

const app=express();
app.use(express.json());


const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bcollection = client.db("book-company").collection("books").findOne({ISBN:"12345Three"});
  bcollection.then((data)=>console.log(data)).catch((err)=>console.log(err));
  // perform actions on the collection object
  //client.close();
});

// async function listDatabases(client){
//     databasesList=await client.db().admin().listDatabases();
//     console.log("THE DATABASES ARE:");
//     databasesList.databases.forEach(db=>console.log(db.name));
// }

// async function main(){
//     const uri = "mongodb+srv://Pragna-19:Pragna1902@cluster0.5xuvq.mongodb.net/book-company?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     try{
//         await client.connect();
//         const result=await client.db("book-company").collection("books").findOne({ISBN:"12345Three"});
//         console.log(result);
//         //await listDatabases(client);
//     }
//     catch(err){
//         console.log(err);
//     }
//     finally{
//         await client.close();
//     }
// }
// main();


//GET APIS 
app.get("/",(req,res) => {
    return res.json({"WELCOME":`to my Backend Software for the Book Company`});
});

app.get("/books",(req,res) => {
    const getAllBooks=db.books;
    return res.json(getAllBooks);
})

app.get("/book-isbn/:isbn",(req,res) => {
    const {isbn}=req.params;
    const getSpecificBook=db.books.filter((book)=>book.ISBN===isbn);
    if(getSpecificBook.length===0){
        return res.json({"error":`No Book found for found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook[0]);
});

app.get("/book-category/:category",(req,res) => {
    const {category}=req.params;
    const getSpecificBook=db.books.filter((book)=>book.category.includes(category));
    if(getSpecificBook.length===0){
        return res.json({"error":`No Book found for found for the category of ${category}`});
    }
    return res.json(getSpecificBook);
});

app.get("/authors",(req,res) => {
    const getAllAuthors=db.authors;
    return res.json(getAllAuthors);
});

app.get("/author-id/:id",(req,res) => {
    let {id}=req.params;
    id=Number(id);
    const getSpecificAuthor=db.authors.filter((author)=>author.id===id);
    if(getSpecificAuthor.length===0){
        return res.json({"error":`No Book found for found for the id of ${isbn}`});
    }
    return res.json(getSpecificAuthor[0]);
});

app.get("/author-isbn/:isbn",(req,res) => {
    const {isbn}=req.params;
    const getSpecificAuthor=db.books.filter((author)=>author.ISBN===isbn);
    if(getSpecificBook.length===0){
        return res.json({"error":`No Author found for found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificAuthor[0]);
});

app.get("/publications",(req,res) => {
    const getAllPublications=db.publications;
    return res.json(getAllPublications);
});

app.get("/publication-isbn/:isbn",(req,res) => {
    const {isbn}=req.params;
    const getSpecificPublication=db.books.filter((publication)=>publication.ISBN===isbn);
    if(getSpecificPublication.length===0){
        return res.json({"error":`No Publication found for found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificPublication[0]);
});


// POST APIS
app.post("/book",(req,res) => {
    //const {newBook}=req.body;
    db.books.push(req.body);
    return res.json(db.books);
});

app.post("/author",(req,res) => {
    //const {newAuthor}=req.body;
    db.authors.push(req.body);
    return res.json(db.authors);
});

app.post("/publication",(req,res) => {
    //const {newPublication}=req.body;
    db.publications.push(req.body);
    return res.json(db.publi);
});

//PUT APIS 
app.put("/book-update/:isbn",(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn}=req.params;
    db.books.forEach((book)=>{
        if(book.ISBN===isbn){
            return {...book, ...req.body};
        }
        return book;
    })
    return res.json(db.books);
});

app.put("/author-update/:isbn",(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn}=req.params;
    db.authors.forEach((author)=>{
        if(author.ISBN===isbn){
            return {...author, ...req.body};
        }
        return author;
    })
    return res.json(db.authors);
});

app.put("/publication-update/:isbn",(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn}=req.params;
    db.publications.forEach((publication)=>{
        if(publication.ISBN===isbn){
            return {...publication, ...req.body};
        }
        return publication;
    })
    return res.json(db.publications);
});

//DELETE API 
app.delete("/book-delete/:isbn",(req,res) => {
    const {isbn}=req.params;
    const filteredBooks=db.books.filter((book)=>book.ISBN!==isbn);
    db.books=filteredBooks;
    return res.json(db.books);
});

app.delete("/publication-delete/:isbn",(req,res) => {
    const {isbn}=req.params;
    const filteredPublications=db.publications.filter((publication)=>publication.ISBN!==isbn);
    db.publications=filteredPublications;
    return res.json(db.publications);
});

app.delete("/author-delete/:isbn",(req,res) => {
    const {isbn}=req.params;
    const filteredAuthors=db.authors.filter((author)=>author.ISBN!==isbn);
    db.books=filteredAuthors;
    return res.json(db.authors);
});

app.delete("/book-author-delete/:isbn/:id",(req,res) => {
    let {isbn,id}=req.params;
    id=Number(id);
    db.books.forEach((book)=>{
        if(book.ISBN===isbn){
            if(!book.authors.includes(id)){
                return;
            }
            book.authors=book.authors.filter((author)=>author!==id);
            return book;
        }
        return book;
    })
    return res.json(db.books);
});

app.listen(3000,()=>{
    console.log("My Express App is Running....")
})