"use client"; // This is a client component 👈🏽

import "survey-core/defaultV2.min.css";

import { Model, Question, NumericValidator } from "survey-core";
import { Survey } from "survey-react-ui";
import { forEachChild } from "typescript";
import { LayeredDarkPanelless } from "survey-core/themes";

import { useState, useEffect } from "react";
import { describe } from "node:test";

const survey = new Model("");
const businessId = "112";
const orderId = "127";
const jwToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkRldlBDMSIsInN1YiI6IkRldlBDMSIsImp0aSI6IjNmMjc0NTUzIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzkwMDAiLCJodHRwczovL2xvY2FsaG9zdDo0NDM0OSIsImh0dHBzOi8vbG9jYWxob3N0OjUwMDYiLCJodHRwOi8vbG9jYWxob3N0OjUwMDUiXSwibmJmIjoxNzI5MzUzODk5LCJleHAiOjE3MzczMDI2OTksImlhdCI6MTcyOTM1MzkwMCwiaXNzIjoiZG90bmV0LXVzZXItand0cyJ9.ytqDAdJHG5J8UyY8-OPHtFljnXn9FvSzQcDuzn9KMFw";
function Calc() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    getInitialBusinessFormData("https://localhost:5006/api/businessform/",businessId);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <Survey model={survey} />;
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
      formData.append("BizId", businessId);
      formData.append("OrderId", orderId);
      var xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      xhr.open(
        "POST",
        "https://localhost:5006/api/upload/businessform/single"
      );
      xhr.setRequestHeader('Authorization', jwToken);
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
      onChangeHandler(survey, sender, options);
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

  //survey.onComplete.add(alertResults);
}

function onChangeHandler(survey, sender, options) {
  survey.getAllQuestions(false).forEach((q) => {
    if (q.name.includes("__res__")) {
      //options.question.value = "10";
      q.value = "";
    }
  });

  survey.setValue(options.question.name, options.question.value);

  //survey.setValue('price', "");

  // console.log(qs);
  //console.log(sender.data);
  //var results1 = POST('https://localhost:5006/api/dyna/', survey, sender.data)
  //console.log(JSON.stringify(sender.data));
  var results1 = POST(
    "https://localhost:5006/api/businessform/",
    survey,
    buildJson(survey, "112")
  );
}
function buildJson(survey: Model, businessId: string) {
  let json = '[{"bizid":{"val":"' + businessId + '"}';
  survey.getAllQuestions(false).forEach((q) => {
    json = json + ',"' + q.name + '":{"val":"' + q.value + '"}';
  });
  json = json + "}]";
  return json;
}

export async function POST(url: RequestInfo | URL, sur: Model, json: any) {
  console.log(url + JSON.stringify({ json }));
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

async function getInitialBizFormData_Mock(url: RequestInfo | URL, businessId: any) {
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

async function getInitialBusinessFormData(url: RequestInfo | URL, businessId: any) {
  console.log(url + businessId);
  //   debugger;
  var response = await fetch(url + businessId, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {},
    redirect: "follow",
  });
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
  console.log(url + JSON.stringify({ json: currentJson }));
  const res = await fetch(url + currentJson, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ json: currentJson }),
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
