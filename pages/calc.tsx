"use client"; // This is a client component 👈🏽

import "survey-core/defaultV2.min.css";

import {Model, Question, NumericValidator} from "survey-core";
import {Survey} from "survey-react-ui";
import {forEachChild} from "typescript";
import {LayeredDarkPanelless} from "survey-core/themes";

import {useState, useEffect} from "react";
import {describe} from "node:test";

const survey = new Model("");
const businessId = "100001";
const initURL = "https://localhost:5006/api/business/initialize/";
const calcURL = "https://localhost:5006/api/business/calculate/";
const fileURL = "https://localhost:5006/api/upload/businessform/single/";
const filePath = "https://api.surveyjs.io/public/v1/Survey/file?filePath=";
const tempRoute = "b1d8de61-fd4a-45ba-a998-01e74a4c6054";
const jwToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjbGllbnQtbmFtZSIsInJvbGUiOiJjbGllbnQiLCJqdGkiOiJjMTM4MTVjZC1hZTQ5LTQ1ZDktYTc4My0zN2RmNGM0Mjc4NzgiLCJzdWIiOiJjbGllbnQtbmFtZSIsIm5iZiI6MTcyOTY4MTkyMiwiZXhwIjoxNzI5Njg5MTIyLCJpc3MiOiJpc3N1ZXIiLCJhdWQiOiJhdWRpZW5jZSJ9.5w910G2VvhFoxpYBQ8UKiL_iRWIPskKStr0MgxsStTU";

function Calc() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        getInitialBusinessFormData(initURL, businessId);
    }, []);

    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    return <Survey model={survey}/>;
}

function buildup(sj: JSON) {
    survey.fromJSON(sj);
    //survey = new Model(sj);
    survey.showCompletedPage = true;
    survey.applyTheme(LayeredDarkPanelless);

    survey.onUploadFiles.add(function (survey, options) {
        options.files.forEach((file) => {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("BusinessId", businessId);
            formData.append("TempRoute", tempRoute);
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("POST", fileURL);
            xhr.setRequestHeader("Authorization", jwToken);
            xhr.onload = () => {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        const data = xhr.response;
                        // debugger;
                        var content = data;
                        // var content = data.replace(
                        //   "dxsfile:",
                        //   "https://api.surveyjs.io/public/v1/Survey/file?filePath="
                        // );
                        // if (data.indexOf("dxsimage:") === 0) {
                        //   content = data.replace(
                        //     "dxsimage:",
                        //     "https://api.surveyjs.io/public/v1/Survey/file?filePath="
                        //   );
                        // }
                        options.callback("success", [
                            {
                                file: file,
                                content: content,
                            },
                        ]);
                    }
                }
            };
            xhr.send(formData);
        });
    });

    survey.onValueChanged.add(function (sender, options) {
        if (
            !options.name.includes("__res__") &&
            !(options.question.getType() == "file")
        ) {
            onChangeHandler(survey, sender);
        }
    });

    survey.onAfterRenderQuestionInput.add(function (sender, options) {
        //debugger;
        console.log(options.question.name + " : " + options.question.value);
        if (
            options.question.inputtype == "text" ||
            options.question.inputtype == "radiogroup"
        ) {
            options.htmlElement.onchange = function (event) {
                //var val = options.question.value;
                options.question.value = event.target?.value;

                //onChangeHandler(survey, sender, options);
            };
        }
    });

    survey.onComplete.add(function (sender, options) {
        onChangeHandler(survey, sender);
    });
}

function onChangeHandler(survey: Model, sender: Model) {
    survey.getAllQuestions(false).forEach((q) => {
        if (q.name.includes("__res__")) {
            //options.question.value = "10";
            q.value = "";
        }
    });

    //survey.setValue(options.question.name, options.question.value);

    //survey.setValue('price', "");

    // console.log(qs);
    //console.log(sender.data);
    //var results1 = POST('https://localhost:5006/api/dyna/', survey, sender.data)
    //console.log(JSON.stringify(sender.data));
    var results1 = POST(calcURL, survey, buildJson(survey, businessId));
}

function buildJson(survey: Model, businessId: string) {
    let json = '[{"bizid":{"val":"' + businessId + '"}';
    survey.getAllQuestions(false).forEach((q) => {
        //debugger
        if (!q.name.includes("__res__")) {
            if (q.getType() == "file") {
                if (!q.isEmpty()) {
                    json = json + ',"' + q.name + '":{"val":"';

                    let isFirst = true;

                    let q1 = q.value as File[];

                    q1.forEach((file) => {
                        if (isFirst) {
                            json = json + file.name;
                            isFirst = false;
                        } else {
                            json = json + "|" + file.name;
                        }
                        console.log("filename: " + file.name);
                    });
                    json = json + '"}';
                    console.log("json: " + json);
                }
            } else {
                json = json + ',"' + q.name + '":{"val":"' + q.value + '"}';
            }
        }
        //console.log(q.name + ':' + q.value);
        //allQuestions[q.name] = q.value ? q.value : ''
    });
    json = json + "}]";
    //console.log(json);

    return json;
}

export async function POST(url: RequestInfo | URL, sur: Model, json: any) {
    console.log(url + JSON.stringify({json}));
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: json,
        redirect: "follow",
    });
    if (!response.ok) return null;

    var responseJson = await response.json();
    //   const myJSON = JSON.stringify(response);
    //   console.log(myJSON);
    //   var pJson = JSON.parse(myJSON);
    var results = JSON.parse(responseJson["result"]);

    debugger;
    for (var item in results[0]) {
        //productName would be "laptop", "cellphone", etc.
        //products[productName] would be an array of brand/price objects
        var res = results[0][item];
        console.log(item + " : " + res.val);
        if (sur.getQuestionByName(item) != null) {
            sur.setValue(item, res.val);
        }
    }
    // sur.setValue('price', myJSON);
    return JSON.stringify(response);
}

async function getInitialBizFormData_Mock(
    url: RequestInfo | URL,
    businessId: any
) {
    console.log(url + businessId);
    var responseJson = mockInitializer;
    try {
        // var responseJson = JSON.parse(response);
        const myJSON = JSON.stringify(responseJson);

        var pJson = JSON.parse(myJSON);
        // var results = responseJson["result"];
        //console.log(JSON.parse(results));

        buildup(JSON.parse(JSON.stringify(responseJson)));
        return responseJson;
    } catch (error) {
        alert(error);
        return null;
    }
}

async function getInitialBusinessFormData(
    url: RequestInfo | URL,
    businessId: any
) {
    console.log(url + businessId);
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    //
    // xhr.addEventListener("readystatechange", function () {
    //     if (this.readyState === 4) {
    //         console.log(this.responseText);
    //     }
    // });
    // xhr.open("GET", url + businessId);
    // xhr.setRequestHeader("Authorization", jwToken);
    //
    // xhr.onload = () => {
    //     if (xhr.readyState === xhr.DONE) {
    //         if (xhr.status === 200)
    //             buildup(JSON.parse(xhr.response));
    //     }
    // };
    // xhr.send();

    var request = fetch(url + businessId, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${jwToken}`
        },
        redirect: "follow",
    });
    var response = await request;
    try {
        if (response.ok) {
            var responseJson = await response.json();
            buildup(responseJson);
            return responseJson;
        } else {
            // Handle error
        }
    } catch (error) {
        alert(error);
        return null;
    }
}

async function getCalculatedBizFormData(
    url: RequestInfo | URL,
    currentJson: any
) {
    console.log(url + JSON.stringify({json: currentJson}));
    const res = await fetch(url + currentJson, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({json: currentJson}),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
                // Handle success
            } else {
                // Handle error
            }
        })
        .then((data) => {
            const myJSON = JSON.stringify(data);

            var pJson = JSON.parse(myJSON);
            var results = pJson["result"];
            //console.log(JSON.parse(results));

            buildup(JSON.parse(results));
            return results;
        })
        .catch((error) => {
            // Handle error
            alert(error.message);
            return null;
        });
}

function businessCreatJson(businessId: string) {
    let json = '[{"businessjson":{"val":"' + businessId + '"}}]';
    //console.log(json);

    return json;
}

export default Calc;
