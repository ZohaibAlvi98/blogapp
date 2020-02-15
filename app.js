var express = require("express"),
methodOverride = require("method-override"),
app = express(),
body_parser = require("body-parser"),
mongoose = require("mongoose")

mongoose.connect("mongodb+srv://admin-zohaib:prince1234@cluster0-x8iaz.mongodb.net/blog", { useNewUrlParser: true , useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(body_parser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
mongoose.set('useFindAndModify', false);

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var blog = mongoose.model("blog",blogSchema);

// blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1534135954997-e58fbd6dbbfc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1566&q=80",
//     body: "Hello This is a Cat!"
// })

app.post("/blogs",function(req,res){
    var data = req.body.blog;

    blog.create(data,function(err,newBlog){
       if(err)
       {
           res.render("new")
       }
       else
       {
           res.redirect("/blogs")
       }
    })
})

app.get("/",function(req,res){
    res.redirect("/blogs")
})

app.get("/blogs/new",function(req,res){
    res.render("new");
})

app.get("/blogs",function(req,res){
    blog.find({}, function(err,blog){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render("index",{blog: blog})
        }
    })

 })

app.get("/blogs/:id",function(req,res){
    var data = req.params.id;
    blog.findById(data,function(err,blog){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render("show",{blog: blog});
        }
    }) 
    
})
// Edit Route
app.get("/blogs/:id/edit",function(req,res){
    var data = req.params.id
    blog.findById(data,function(err,blog){
       if(err)
       {
           console.log(err)
       }
       else
       {
        res.render("edit",{blog: blog});
       }
    })
})

// Update Route
app.put("/blogs/:id",function(req,res){
   var data = req.params.id;
   var newData = req.body.blog;
        blog.findByIdAndUpdate(data, newData, function(err,update){
            if(err)
            {
                console.log(err)
            }
            else
            {
            res.redirect("/blogs/" + data)
            }
        })
    })
  
app.delete("/blogs/:id",function(req,res){
    var data = req.params.id
    blog.findById(data,function(err,blog){
        if(err)
        {
            res.redirect("/blogs")
        }
        else
        {
            //res.redirect("/blogs")
            res.render("admin",{blog: blog})
        }
    })
})

app.delete("/blogs/:id/delete",function(req,res){
    var id = req.params.id
    var name = req.body.name
    var password = req.body.password
    if(name == "admin-zohaib" && password == "prince1234")
    {
        blog.findByIdAndRemove(id,function(err,blog){
            if(err)
            {
                res.redirect("/blogs")
            }
            else
            {
                res.redirect("/blogs")
            }
        })
    }
    else
    {
        res.redirect("back")
    }
})

app.listen(process.env.PORT || 5000)
