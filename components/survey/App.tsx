
import 'survey-core/defaultV2.min.css';
import './custom.module.css';

import { Model, Question, NumericValidator } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Booking, QueryBookings } from "../../lib/dtos"
import { forEachChild } from 'typescript';
import { ThreeDimensionalLightPanelless } from 'survey-core/themes/three-dimensional-light-panelless';
import { useState, useEffect } from 'react'

import surveyJson from './json.tsx'
import { send } from 'process';

// const SURVEY_ID = 1;

/*
const surveyJson = {
    "elements": [
        {
            "name": "len",
            "type": "text",
            "inputType": "text",
            "title": "Length",
            "isRequired": true,
            "validators": [
                { "type": "numeric", "text": "Value must be a number" }
            ],
        },
        {
            "name": "wid",
            "type": "text",
            "inputType": "text",
            "title": "Width",
            "isRequired": true,
            "validators": [
                { "type": "numeric", "text": "Value must be a number" }
            ],
        },
        {
            "name": "qty",
            "type": "text",
            "inputType": "text",
            "title": "Qty",
            "isRequired": true,
            "validators": [
                { "type": "numeric", "text": "Value must be a number" }
            ],
        },
        {
            "name": "price",
            "type": "comment",
            "inputType": "text",
            "title": "Price",
        }
    ]
};
*/

const survey = new Model("");
function App() {

    //const [custParam, setCustParam] = useState(false);

    //dbhandler();
    // Avoid rehydration conflict
    // https://nextjs.org/docs/messages/react-hydration-error
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    debugger;
    const surveyJson1 = getSurveyJson('https://localhost:5001/dyna/', bizCreatJson("112"));
    return <Survey model={survey} />;
}



function buildup(sj: JSON) {

    survey.fromJSON(sj)
    //survey = new Model(sj);
    survey.showCompletedPage = true;
    survey.applyTheme(ThreeDimensionalLightPanelless);


    survey.onUploadFiles.add(function (survey, options) {
        debugger;
        options.files.forEach(file => {
            var formData = new FormData();
            formData.append('postId', 'cbd4f8b2-f9df-4eb0-99f7-2dcc61a41d03');
            formData.append("file", file);
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("POST", "https://api.surveyjs.io/public/v1/Survey/upload/");
            xhr.onload = () => {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        const data = xhr.response;
                        var content = data.replace('dxsfile:', 'https://api.surveyjs.io/public/v1/Survey/file?filePath=');
                        if (data.indexOf("dxsimage:") === 0) {
                            content = data.replace('dxsimage:', 'https://api.surveyjs.io/public/v1/Survey/file?filePath=');
                        }
                        options.callback("success", [{
                            file: file,
                            content: content
                        }]);
                    }
                }
            };
            xhr.send(formData);
        });
    });

    survey.onValueChanged.add(function (sender, options) {
        if (!options.name.includes("__res__") && !(options.question.getType() == "file")) {
           
            onChangeHandler(survey, sender, options);
        }
    });


    survey.onAfterRenderQuestionInput.add(function (sender, options) {

        //debugger;
        console.log(options.question.name + " : " + options.question.value);
        if (options.question.inputtype == "text" || options.question.inputtype == "radiogroup") {
            options.htmlElement.onchange = function (event) {

                //var val = options.question.value;
                options.question.value = event.target?.value;

                //onChangeHandler(survey, sender, options);

            }
        }
    });

    //survey.onComplete.add(alertResults);


}

function onChangeHandler(survey, sender, options) {
    
    survey.getAllQuestions(false).forEach(q => {
        if (q.name.includes("__res__")) {
            //options.question.value = "10";
            q.value = "";
        }
    })

             



    survey.setValue(options.question.name, options.question.value);


    //survey.setValue('price', "");

    // console.log(qs);
    //console.log(sender.data);
    //var results1 = POST('https://localhost:5001/dyna/', survey, sender.data)
    //console.log(JSON.stringify(sender.data));
    var results1 = POST('https://localhost:5001/dyna/', survey, buildJson(survey, "112"))

}
function buildJson(survey: Model, bizid: string) {
    let json = '[{\"bizid\":{\"val\":\"' + bizid + '\"}';
    survey.getAllQuestions(false).forEach(q => {

        json = json + ',\"' + q.name + '\":{\"val\":\"' + q.value + '\"}';
        //console.log(q.name + ':' + q.value);
        //allQuestions[q.name] = q.value ? q.value : ''
       
       
    }
    )
    json = json + '}]'
    //console.log(json);

    return json
}

export async function POST(url: RequestInfo | URL, sur: Model, json: any) {
    console.log(url + JSON.stringify({ json }))
    const res = await fetch(url + json , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({json}),
    }).then(response => {
        if (response.ok) {
            return response.json();
            // Handle success
        } else {
            // Handle error
        }
    }).then(data => {

        const myJSON = JSON.stringify(data);
        console.log(myJSON);
        //alert('Data received:' + myJSON);
        var pJson = JSON.parse(myJSON);
        var results = pJson['result'];
        var nJson = JSON.parse(results);
        //debugger;
        
        for (var item in nJson[0]) {
            //productName would be "laptop", "cellphone", etc.
            //products[productName] would be an array of brand/price objects
            var res = nJson[0][item];
           // console.log(item + " : " + res.val);
                 if(sur.getQuestionByName(item) != null)
                    sur.setValue(item, res.val);   
        }
       // sur.setValue('price', myJSON);
        return myJSON;
 
    }).catch(error => {
        // Handle error
        alert(error.message);
        return null
    });

}

export async function getSurveyJson(url: RequestInfo | URL, json: any) {
    console.log(url + JSON.stringify({ json }))
    const res = await fetch(url + json, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json }),
    }).then(response => {
        if (response.ok) {
            return response.json();
            // Handle success
        } else {
            // Handle error
        }
    }).then(data => {

        const myJSON = JSON.stringify(data);

        var pJson = JSON.parse(myJSON);
        var results = pJson['result'];
        //console.log(JSON.parse(results));
    
        buildup(JSON.parse(results));
        return results;

    }).catch(error => {
        // Handle error
        alert(error.message);
        return null
    });

}

function bizCreatJson(bizid: string) {
    let json = '[{\"bizjson\":{\"val\":\"' + bizid + '\"}}]';
    //console.log(json);

    return json
}
export default App;
