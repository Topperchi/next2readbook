var request = require('request');
// import Sequelize from 'sequelize';
// import { databaseUrl } from '../src/config';
// import Eventslist from '../src/data/models/Events';
var fs = require('fs');

let url = 'https://graph.facebook.com/v2.8/me?fields=id,name,events.limit(100){id,start_time,description,owner,end_time,parent_group,name}'

url = url + '&access_token=EAACEdEose0cBAPzvppyzPLzl9H67L5upLfIcqGCe2XNHjNMuZCu0tk0PbUqPvhuXdPZC1UZCmlPfYDlc0IEnv8WV5vkmrhqgXYTpUpB7uvyIT58ZCeyNbK2odnfb0umu3dc8CmQIgNrACrKSq5p2YwwRdGBUGUc1fxBArJXedsnyc0in9Pzyzk09ADNBs7gZD'

let alldata = [];

go(url);
async function go(url) {
    //console.log(url);
    request(url, function (err, res, body) {
        let item = JSON.parse(body);
        // console.log(item.events.data);
        //console.log(item.events.paging.next);

        let next = item.events.paging.next;

        item.events.data.map((v) => {
            let data = {};
            data.start_time = v.start_time;
            data.title = v.name;
            data.description = v.description;
            data.speaker = '';
            data.startTime = v.start_time;
            data.endTime = v.end_time;
            if (typeof (v.parent_group) == "object") {
                data.parentGroupName = v.parent_group.name;
                data.parentGroupId = v.parent_group.id;
                data.privacy = v.parent_group.privacy;
                data.owner = v.owner.name;
                //  Eventslist.build(data).save();
            }
            if (v.owner.name == "紀相安") {
                alldata.push(data);
            }

            //console.log(typeof (v.parent_group));
        })
        //console.log(item.events);
        if (next != "") {
            setTimeout(function () {
                console.log('下一次的旅行');

                go2(next);
            }, 3000);
        }
    });
}
async function go2(url) {
    console.log("url:" + url);
    if (typeof (url) === "undefined") {
        console.log("最後一筆");
        console.log(alldata);
        fs.writeFile("data/lessonData.json", JSON.stringify(alldata));
        return
    }
    request(url, function (err, res, body) {
        let item = JSON.parse(body);
        //console.log(item.events.data);
        //console.log(item);

        if (typeof (item.paging) == "object") {
            let next = item.paging.next;
        } else {
            let next = "";
            console.log("最後一筆");
        }



        let next = item.paging.next;
        console.log(typeof (item.paging));

        console.log("item:" + typeof (item));
        item.data.map((v) => {
            let data = {};
            data.start_time = v.start_time;
            data.title = v.name;
            data.description = v.description;
            data.speaker = '';
            data.startTime = v.start_time;
            data.endTime = v.end_time;
            if (typeof (v.parent_group) == "object") {
                data.parentGroupName = v.parent_group.name;
                data.parentGroupId = v.parent_group.id;
                data.privacy = v.parent_group.privacy;
                data.owner = v.owner.name;
                // Eventslist.build(data).save();
            }
            if (v.owner.name == "紀相安") {
                alldata.push(data);
            }
            //console.log(typeof (v.parent_group));
        })





        if (next != "") {
            setTimeout(function () {
                console.log('下一次的旅行');
                //   console.log(next);
                go2(next);
            }, 3000);
        }
    });



}
