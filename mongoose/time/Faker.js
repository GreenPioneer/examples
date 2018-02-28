var totalNumber = 5
var mongoose = require('mongoose');
var faker = require('faker');
var moment = require('moment');
mongoose.Promise = global.Promise
mongoose.set('debug', false)
mongoose.connect('mongodb://localhost:27017/faker', {
  poolSize: 25
})
mongoose.connection.dropDatabase()
var Models = require('./Models.js')
var Teams =[]
var Users =[]
var Projects =[]
var Records =[]
var UserLedger = {}
var TeamLedger = []
var Timesheet = {}
//TIME CREATE
var startCreate = new Date();
var hrstartCreate = process.hrtime();
for(var i =0; i< totalNumber ; i++){
    var team = new Models.Team({
        name:  faker.internet.userName()
    })
    Teams.push(team)
    team.save()
}
for(var i =0; i< totalNumber ; i++){
    let _team = Teams[i]
    var user = new Models.User({
        name: faker.name.findName(),
        teamIds: [_team._id]
    })
    Users.push(user)
    UserLedger[_team._id] = user._id
    user.save()
}
for(var i =0; i< totalNumber ; i++){
    let ran = getRandomLimit(totalNumber-1)
   
    let _team = Teams[ran]
    //PROJECT
    var project = new Models.Project({
        name: faker.random.word() + ' project',
        description: faker.lorem.paragraph(),
        teamId: _team._id
    })
    Projects.push(project)
    
    //TASK
    let Tasks =[]
    for(var e =0; e< totalNumber ; e++){
        //fake.random.boolean  FOR OCCURENCE
        var task = new Models.Task({
            name: faker.random.word() + ' task',
            projectId: project._id
        })
        Tasks.push(task)
        task.save()
        Models.Status.create({
            content:faker.lorem.sentence(),
            status:faker.company.catchPhrase(),
            taskId:task._id,
            userId:UserLedger[_team._id]
        },{
            content:faker.lorem.sentence(),
            status:faker.company.catchPhrase(),
            taskId:task._id,
            userId:UserLedger[_team._id]
        },{
            content:faker.lorem.sentence(),
            status:faker.company.catchPhrase(),
            taskId:task._id,
            userId:UserLedger[_team._id]
        })
    }
    TeamLedger.push({
        userId:UserLedger[_team._id],
        teamId:_team._id,
        projectId:project._id,
        Tasks:Tasks
    })
    //STATUS 
    Models.Status.create({
        content:faker.lorem.sentence(),
        status:faker.company.catchPhrase(),
        projectId:project._id,
        userId:UserLedger[_team._id]
    },{
        content:faker.lorem.sentence(),
        status:faker.company.catchPhrase(),
        projectId:project._id,
        userId:UserLedger[_team._id]
    },{
        content:faker.lorem.sentence(),
        status:faker.company.catchPhrase(),
        projectId:project._id,
        userId:UserLedger[_team._id]
    })
    //
    project.save()
    var demandTemp = []
    // SIMULATE 12 months back and 12 months ahead
    var twelveMonthsBackDate = moment().subtract({months:12}).format()
    for(var d = 1; d <= 24; d++){
        demandTemp.push({
            hours:getRandomLimit(40),
            date: moment(twelveMonthsBackDate).add({months:d}),
            projectId:project._id,
            userId: UserLedger[_team._id]
        })
    }
    Models.Demand.create(demandTemp)
}
for(var i =0; i< 1500 ; i++){
    let _team = getRandomLimit(totalNumber-1)
    let _date = moment(faker.date.recent(getRandomLimit(365)))
    //TIME SHEETS
    let timesheet
    if(!Timesheet[TeamLedger[_team].userId]) Timesheet[TeamLedger[_team].userId] = {}
    if(!Timesheet[TeamLedger[_team].userId][_date.year()]) Timesheet[TeamLedger[_team].userId][_date.year()] = {}
    if(!Timesheet[TeamLedger[_team].userId][_date.year()][_date.week()]) Timesheet[TeamLedger[_team].userId][_date.year()][_date.week()] = {}
    if(!Timesheet[TeamLedger[_team].userId][_date.year()][_date.week()]._id){
        timesheet = new Models.Timesheet({
            week: _date.week(),
            year: _date.year(),
            //projectId:{ type: mongoose.Schema.Types.ObjectId, index:true,ref: 'Project' },
            userId:TeamLedger[_team].userId
        })
        Timesheet[TeamLedger[_team].userId][_date.year()][_date.week()] = timesheet
        timesheet.save()
        Models.Status.create({
            content:faker.lorem.sentence(),
            status:faker.company.catchPhrase(),
            timesheetId:timesheet._id,
            userId:TeamLedger[_team].userId
        },{
            content:faker.lorem.sentence(),
            status:faker.company.catchPhrase(),
            timesheetId:timesheet._id,
            userId:TeamLedger[_team].userId
        },{
            content:faker.lorem.sentence(),
            status:faker.company.catchPhrase(),
            timesheetId:timesheet._id,
            userId:TeamLedger[_team].userId
        })
    }
    //RECORD
    var record = new Models.Record({
        hours: getRandomLimit(8),
        date: _date.format(),
        projectId:TeamLedger[_team].projectId,
        taskId: TeamLedger[_team].Tasks[getRandomLimit(totalNumber-1)]._id,
        userId: TeamLedger[_team].userId,
        teamId: TeamLedger[_team].teamId,
        timesheetId: Timesheet[TeamLedger[_team].userId][_date.year()][_date.week()]._id
    })
    Records.push(record)
    record.save(function(err){
        if(i==0){
            console.log(record,'record')
            console.log(err)
        }
    })
}
var endCreate = new Date() - startCreate,
hrendCreate = process.hrtime(hrstartCreate);
console.info("Create Execution time: %dms", endCreate);
console.info("Create Execution time (hr): %ds %dms", hrendCreate[0], hrendCreate[1]/1000000);


function getRandomLimit(limit){
    return Math.floor(Math.random() * limit) + 1 
}