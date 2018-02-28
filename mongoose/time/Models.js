var mongoose = require('mongoose')
var moment = require('moment');

var TeamSchema = new mongoose.Schema({
    name: String
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
var UserSchema = new mongoose.Schema({
    name: String,
    teamIds:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
UserSchema.virtual('status', {
    ref: 'Status',
    localField: '_id',
    foreignField: 'userId',
    justOne:false
})
var ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    completed: {
        type:Boolean,
        default:false
    },
    teamId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
ProjectSchema.virtual('records', {
    ref: 'Record',
    localField: '_id',
    foreignField: 'projectId',
    justOne:false
})
ProjectSchema.virtual('demand', {
    ref: 'Demand',
    localField: '_id',
    foreignField: 'projectId',
    justOne:false,
    sort: { date: -1 }
})
ProjectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'projectId',
    justOne:false
})
ProjectSchema.virtual('status', {
    ref: 'Status',
    localField: '_id',
    foreignField: 'projectId',
    justOne:false
})

var TaskSchema = new mongoose.Schema({
    name: String,
    completed: {
        type:Boolean,
        default:false
    },
    // demandId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    // budgetId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    // occurenceId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Occurence' },
    projectId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
TaskSchema.virtual('status', {
    ref: 'Status',
    localField: '_id',
    foreignField: 'taskId',
    justOne:false
})





var RecordSchema = new mongoose.Schema({
    hours: Number,
    date: Date,
    projectId: { type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Project' },
    taskId: { type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Task' },
    userId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'User' },
    teamId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Team' },
    timesheetId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Timesheet' }
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
var DemandSchema = new mongoose.Schema({
    hours: Number,
    month: Number,
    year: Number,
    quarter: Number,
    date: Date,
    projectId:{ type: mongoose.Schema.Types.ObjectId, index:true,ref: 'Project' },
    userId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'User' },    
    taskId:{ type: mongoose.Schema.Types.ObjectId, index:true,ref: 'Task' } 
    // [] hours spent
    // USE LEAN  / LOOK INTO LEAN FOR QUERIES
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
DemandSchema.pre('save', function (next) {
    var doc = this
    if (doc.isNew) {
        doc.month =  moment(doc.date).month()
        doc.year =  moment(doc.date).year()
        doc.quarter =  moment(doc.date).quarter()
    }
    next()
})

var TimesheetSchema = new mongoose.Schema({
    week: Number,
    year: Number,
    //projectId:{ type: mongoose.Schema.Types.ObjectId, index:true,ref: 'Project' },
    userId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'User' }
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
TimesheetSchema.virtual('records', {
    ref: 'Record',
    localField: '_id',
    foreignField: 'timesheetId',
    justOne:false
})
TimesheetSchema.virtual('status', {
    ref: 'Status',
    localField: '_id',
    foreignField: 'timesheetId',
    justOne:false
})
var StatusSchema = new mongoose.Schema({
    content:String,
    status:String,
    date: {
        type:Date,
        default:Date.now()
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Project' },
    taskId: { type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Task' },
    userId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'User' },
    timesheetId:{ type: mongoose.Schema.Types.ObjectId, index:true, ref: 'Timesheet' }
},{
    'toJSON':{ virtuals: true },
    'toObject':{ virtuals: true }
})
module.exports = {
    Task:mongoose.model('Task', TaskSchema,'Task'),
    Team:mongoose.model('Team', TeamSchema,'Team'),
    User:mongoose.model('User', UserSchema,'User'),
    Project:mongoose.model('Project', ProjectSchema,'Project'),
    Record:mongoose.model('Record', RecordSchema,'Record'),
    Demand:mongoose.model('Demand', DemandSchema,'Demand'),
    Status:mongoose.model('Status', StatusSchema,'Status'),
    Timesheet:mongoose.model('Timesheet', TimesheetSchema,'Timesheet')
}

// var StatusSchema = new mongoose.Schema({
//     name: String,
//     type: String,
//     stage: String,
//     status: String,
//     projectId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
// })
// var Status = mongoose.model('Status', StatusSchema,'Status')
// StatusSchema.set('toObject', { virtuals: true })
// StatusSchema.set('toJSON', { virtuals: true })
// var Statuss =[]


