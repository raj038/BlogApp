var express=require("express")
var app=express();
var mongoose=require("mongoose");
var bodyparser=require("body-parser");
var methodoverride=require("method-override");
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/blogdb");
app.use(express.static("public"));
app.use(methodoverride("_method"));
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default:Date.now}
})
var blog=mongoose.model("blog",blogSchema);

app.get("/",function(req,res)
{
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res)
{
    blog.find({},function(err,blogs)
    {
        if(err)
        {
            console.log("There Is An Error ");
        }
        else
        {
            res.render("index",{blogs:blogs});
        }
    })
})

app.get("/blogs/new",function(req,res)
{
    res.render("newBlog");
})

app.post("/blogs",function(req,res)
{
    blog.create(req.body.blog,function(err,data)
    {
        if(err)
        {
            res.render("newblog");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id",function(req,res)
{
    blog.findById(req.params.id,function(err,data)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show",{data:data});
        }
    });
})

app.get("/blogs/:id/edit",function(req,res)
{   
    blog.findById(req.params.id,function(err,data)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{data:data});
        }
    })
});

app.put("/blogs/:id",function(req,res)
{
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,data)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

app.delete("/blogs/:id",function(req,res)
{
    blog.findByIdAndDelete(req.params.id,function(err)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    })    
})

app.listen(3000, () => console.log(`http://localhost:${3000}`));