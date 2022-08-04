const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Notes = mongoose.model('notes');

router.get("/", (req, res) => {

  if("title" in req.query)
  {
    Notes.find(
      { "title": { "$regex": req.query.title, "$options": "i" },user_id: res.locals.user._id  },
      function(err,docs) { 
        res.json(docs)
      } 
  );
  }
  
  else if("is_pinned" in req.query)
  {
    Notes.find(
      { "is_pinned" :req.query.is_pinned,user_id: res.locals.user._id  },
      function(err,docs) { 
        res.json(docs)
      } 
  );
  }

  else if("tag" in req.query)
  {
    console.log('Tag Found'+ req.query.tag)
    var kk = []
    kk.push(req.query.tag)
    Notes.find(
      {  "tags": { "$regex": req.query.tag, "$options": "i" }  ,user_id: res.locals.user._id  },
      function(err,docs) { 
        res.json(docs) 
      } 
  );
  }

  else
  {
    Notes.find({user_id: res.locals.user._id}, (err, row) => {
      res.json(row);
    });
  }

});

router.get("/:id", (req, res) => {
  Notes.findById(req.params.id,  (err, row) => {
    res.json(row);
  });  
});


router.post("/", (req, res) => {
  req.body.user_id = res.locals.user._id;
  Notes.create(req.body, (err, row) => {
    res.json(row); //.json() will send proper headers in response so client knows it's json coming back
  });
});

router.delete("/:id", (req, res) => {
  Notes.findByIdAndRemove(req.params.id, (err, row) => {
    res.json(row);
  });
});




router.put("/:id", (req, res) => {
  Notes.findByIdAndUpdate(req.params.id, req.body, (err, row) => {
    res.json(row);
  });
});

module.exports = router;
