
var mongoose = require('mongoose');
var moment = require('moment');
mongoose.Promise = global.Promise
mongoose.set('debug', false)
mongoose.connect('mongodb://localhost:27017/faker', {
  poolSize: 25
})
var Models = require('./Models.js')

var start = new Date();
var hrstart = process.hrtime();
    
//COUNTS
Models.Record.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Record count Execution time: %dms", end);
    console.info("Record count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
Models.Project.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Project count Execution time: %dms", end);
    console.info("Project count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
Models.User.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("User count Execution time: %dms", end);
    console.info("User count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
Models.Team.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Team count Execution time: %dms", end);
    console.info("Team count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
Models.Task.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Team count Execution time: %dms", end);
    console.info("Team count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
Models.Demand.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Demand count Execution time: %dms", end);
    console.info("Demand count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
Models.Status.find().count().exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Status count Execution time: %dms", end);
    console.info("Status count Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})
// PROJECTS
Models.Project.findOne().populate('records').exec(function(err,data){
    //console.log(data)
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("PROJECT Execution time: %dms", end);
    console.info("PROJECT Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data.records.length)
})


Models.Project.aggregate([
    // { 
    //     $match: {_id: mongoose.Types.ObjectId('5a946c4e30f5160d6b6a7163')} 
    // },
    {
        $lookup:{
          from: 'Record',
          localField: '_id',
          foreignField: 'projectId',
          as: 'records'
        }
    }
]).exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Aggregate Execution time: %dms", end);
    console.info("Aggregate Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    // console.log(data[0].records.length)
    // console.log(data[0].records[0])
})
Models.Project.aggregate([
    // { 
    //     $match: {_id: mongoose.Types.ObjectId('5a8f85c1be234a1496b3ed46')} 
    // },
    {
        $lookup:{
          from: 'Record',
          localField: '_id',
          foreignField: 'projectId',
          as: 'records'
        }
    },
    {
        $unwind : "$records"
    },
    {
        $group: {
            _id: "$_id",
            averageQuantity: { $avg: "$records.hours" },
            count: { $sum: 1 },
            name:{ $first: "$name" },
            completed:{ $first: "$completed" }
        }
    }

]).exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Aggregate2 Execution time: %dms", end);
    console.info("Aggregate2 Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data[0],'this')
})

// TASKS
Models.Task.findOne().populate('records').exec(function(err,data){
    //console.log(data)
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("TASK Execution time: %dms", end);
    console.info("TASK Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data.records.length)
})
// RECORDS
Models.Record.findOne().populate('projectId taskId userId teamId').exec(function(err,data){
    //console.log(data)
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data)
})

//DEMAND
Models.Demand.findOne().populate('projectId userId taskId').exec(function(err,data){
        //console.log(data)
        var end = new Date() - start,
        hrend = process.hrtime(hrstart);
        console.info("FindOne Execution time: %dms", end);
        console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
        console.log(data.length)
})

Models.Project.findOne()
.populate({ path: 'demand', options: { sort: { date: 1 }}})
.populate({ path: 'records', options: { sort: { date: 1 }}})
.populate({ path: 'tasks', options: { sort: { completed: 1 },select:'name completed'}})
.lean()
.exec(function(err,data){
        //console.log(data)
        var end = new Date() - start,
        hrend = process.hrtime(hrstart);
        
        let records = {}
        for(var i = 0; i < data.records.length; i++){
            let date = moment(data.records[i].date)
            let month = date.month()
            let year = date.year()
            if(!records[year])records[year] = {}
            if(!records[year][month])records[year][month] = []
            records[year][month].push(data.records[i])
        }
        data.records = records
        let demand = {
            totalDemand:0,
            totalHours:0
        }
        for(let d = 0; d < data.demand.length; d++){
            let tempData = data.demand[d]
            if(!demand[tempData.year])demand[tempData.year] = {}
            if(!demand[tempData.year][tempData.month])demand[tempData.year][tempData.month] = {}
            if(!demand[tempData.year][tempData.month][tempData.userId])demand[tempData.year][tempData.month][tempData.userId] = {}
            demand[tempData.year][tempData.month][tempData.userId] = data.demand[d]
            demand.totalDemand += tempData.hours
            if(!demand[tempData.userId]) demand[tempData.userId] = {usedHours: 0,demandHours:0}
            demand[tempData.userId].demandHours += tempData.hours
            if(records[tempData.year]){
                if(records[tempData.year][tempData.month]){
                    for(let c =0; c < records[tempData.year][tempData.month].length;c++){
                        demand.totalHours += records[tempData.year][tempData.month][c].hours
                        demand[tempData.userId].usedHours += records[tempData.year][tempData.month][c].hours
                    }
                }
            }
        }
        data.demand = demand
        console.info("FindOne Execution time: %dms", end);
        console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
        //console.log(data)
})

//TIMESHEET
Models.Timesheet.findOne().populate('records').exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
})

Models.Timesheet.aggregate([
    // {
    //     $lookup:{
    //       from: 'User',
    //       localField: '_id',
    //       foreignField: 'userId',
    //       as: 'userId'
    //     }
    // },
    // {
    //     $unwind: "$user"
    // },
    {
        $lookup:{
          from: 'Record',
          localField: '_id',
          foreignField: 'timesheetId',
          as: 'records'
        }
    },
    {
        $unwind : "$records"
    },
    {
        $group: {
            _id: "$_id",
            averageQuantity: { $avg: "$records.hours" },
            count: { $sum: 1 },
            totalHours: { $sum: "$records.hours" },
            week:{ $first: "$week" },
            year:{ $first: "$year" },
            userId:{ $first: "$userId" }
        }
    }
]).exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("Aggregate3 Execution time: %dms", end);
    console.info("Aggregate3 Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data[0],'this')
})

// STATUS
Models.User.findOne().populate('status').exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data)
})

Models.Project.findOne().populate('status').exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data)
})
Models.Task.findOne().populate('status').exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data)
})
Models.Timesheet.findOne().populate('status').exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    //console.log(data)
})

//EVERYTHING
Models.Project.findOne()
.populate({ path: 'demand', options: { sort: { date: -1 },select:'hours date',limit:25}})
.populate({ path: 'records', options: { sort: { date: -1 },select:'hours date',limit:25}})
.populate({ path: 'status', options: { sort: { date: -1 }}})
.populate({ path: 'tasks', options: { sort: { completed: 1 },select:'name completed'}})
.lean()
.exec(function(err,data){
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    console.info("FindOne Execution time: %dms", end);
    console.info("FindOne Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    console.log(data)
})