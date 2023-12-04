const express= require("express");
const { authAdmin,auth } = require("../middlewares/auth");
const {validateCompany,CompanyModel} = require("../models/companyModel")
const router = express.Router();

router.get("/", async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await CompanyModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.get("/count",async(req,res)=>{
  try {
    const perPage = req.query.perPage || 10
    const count = await CompanyModel.countDocuments({})
    res.json({count,pages: Math.ceil(count/perPage)})
  } catch (error) {
    console.log(error);
    res.status(502).json({error})
  }
})

// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", async(req,res) => {
  try{
    let data = await CompanyModel.findOne({_id:req.params.id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

//  auth of admin
router.post("/" , auth, async(req,res) => {
  let validBody = validateCompany(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let cateogry = new CompanyModel(req.body);
    await cateogry.save();
    res.status(201).json(cateogry);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.put("/:id", authAdmin,async(req,res) => {
  let validBody = validateCompany(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let id = req.params.id;
    let data = await CompanyModel.updateOne({_id:id},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.delete("/:id", authAdmin,async(req,res) => {
  try{
    let id = req.params.id;
    let data = await CompanyModel.deleteOne({_id:id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;