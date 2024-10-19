const surveyJson = {

    "title": "PCB From Class 1",
    "completedHtml": "<h3>Thank you for your feedback</h3>",
    "completedHtmlOnCondition": [
        {
            "html": "<h3>Thank you for your feedback</h3> <h4>We are glad that you love our product. Your ideas and suggestions will help us make it even better.</h4>"
        },
        {
            "html": "<h3>Thank you for your feedback</h3> <h4>We are glad that you shared your ideas with us. They will help us make our product better.</h4>"
        }
    ],
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "panel",
                    "name": "panel1",
                    "elements": [
                        {
                            "type": "text",
                            "name": "len",
                            "width": "5%",
                            "minWidth": "100px",
                            "title": "طول",
                            "titleLocation": "top",
                            "defaultValue": "10",
                            "errorLocation": "bottom"
                        },
                        {
                            "type": "text",
                            "name": "wid",
                            "width": "5%",
                            "minWidth": "100px",
                            "title": "عرض",
                            "titleLocation": "top",
                            "defaultValue": "10",
                            "errorLocation": "bottom",
                            "startWithNewLine": false
                        },
                        {
                            "type": "dropdown",
                            "name": "lay",
                            "width": "10%",
                            "minWidth": "150px",
                            "title": "تعداد لایه",
                            "titleLocation": "top",
                            "defaultValue": "2",
                            "choices": [
                                {
                                    "value": "2",
                                    "text": "2 لایه"
                                },
                                {
                                    "value": "4",
                                    "text": "4 لایه"
                                },
                                {
                                    "value": "6",
                                    "text": "6 لایه"
                                }
                            ],
                            "allowClear": false,
                            "startWithNewLine": false
                        },
                        {
                            "type": "dropdown",
                            "name": "qty",
                            "width": "5%",
                            "minWidth": "120px",
                            "title": "تعداد",
                            "titleLocation": "top",
                            "defaultValue": "5",
                            "choices": [
                                "5",
                                "10",
                                "15",
                                "20",
                                "25",
                                "30",
                                "50"
                            ],
                            "allowClear": false,
                            "startWithNewLine": false
                        },
                        {
                            "type": "dropdown",
                            "name": "thick",
                            "width": "6%",
                            "minWidth": "130px",
                            "title": "ضخامت برد",
                            "titleLocation": "top",
                            "setValueExpression": "iif({layers} = 4 and {thick} < 1.0 , 1.0 ,iif({layers} = 6 and {thick} < 1.2, 1.2 , {thick}))",
                            "defaultValue": "1.6",
                            "choices": [
                                "0.6",
                                "0.8",
                                "1.0",
                                "1.2",
                                "1.6",
                                "2.0"
                            ],
                            "allowClear": false,
                            "startWithNewLine": false
                        },
                        {
                            "type": "dropdown",
                            "name": "surfish",
                            "width": "8%",
                            "minWidth": "150px",
                            "title": "پوشش نهایی",
                            "titleLocation": "top",
                            "defaultValue": "hasl",
                            "choices": [
                                {
                                    "value": "hasl",
                                    "text": "HASL"
                                },
                                {
                                    "value": "enig",
                                    "text": "ENIG"
                                }
                            ],
                            "allowClear": false,
                            "startWithNewLine": false
                        },
                        {
                            "type": "dropdown",
                            "name": "copthick",
                            "width": "11%",
                            "minWidth": "220px",
                            "title": "ضخامت مس",
                            "titleLocation": "top",
                            "defaultValue": "1oz",
                            "choices": [
                                {
                                    "value": "1oz",
                                    "text": "1OZ (35 میکرون)"
                                },
                                {
                                    "value": "2oz",
                                    "text": "2OZ (70 میکرون)"
                                }
                            ],
                            "allowClear": false,
                            "startWithNewLine": false
                        },

                        {
                            "type": "dropdown",
                            "name": "mat",
                            "width": "8%",
                            "minWidth": "240px",
                            "title": "جنس برد",
                            "titleLocation": "top",
                            "defaultValue": "fr4",
                            "choices": [
                                {
                                    "value": "fr4",
                                    "text": "FR4-TG135"
                                },
                                {
                                    "value": "alu",
                                    "text": "Aluminum"
                                }
                            ],
                            "allowClear": false,
                            "startWithNewLine": false
                        },
                        {
                            "type": "radiogroup",
                            "name": "solcol",
                            "title": "Solder Mask Color",
                            "setValueExpression": "iif({silcol}='black' ,  'white' , iif({solcol}='white', green, {solcol}))",
                            "defaultValue": "green",
                            "isRequired": true,
                            "choices": [
                                {
                                    "value": "green",
                                    "text": "Green"
                                },
                                {
                                    "value": "blue",
                                    "text": "Blue"
                                },
                                {
                                    "value": "red",
                                    "text": "Red"
                                },
                                {
                                    "value": "yellow",
                                    "text": "Yellow"
                                },
                                {
                                    "value": "black",
                                    "text": "Black"
                                },
                                {
                                    "value": "white",
                                    "text": "White"
                                }
                            ],
                            "colCount": 4
                        },
                        {
                            "type": "radiogroup",
                            "name": "silcol",
                            "startWithNewLine": false,
                            "title": "Silkscreen Color",
                            "setValueExpression": "iif({solcol}='white' ,  'black' , 'white')",
                            "defaultValue": "white",
                            "defaultValueExpression": "iif({solcol}='white' ,  'black' , 'white')",
                            "choices": [
                                {
                                    "value": "white",
                                    "text": "White"
                                },
                                {
                                    "value": "black",
                                    "text": "Black"
                                }
                            ]
                        },
                        {
                            "type": "dropdown",
                            "name": "type",
                            "startWithNewLine": false,
                            "title": "Production Plan",
                            "defaultValue": "reg",
                            "choices": [
                                {
                                    "value": "reg",
                                    "text": "Regular"
                                },
                                {
                                    "value": "sch",
                                    "text": "Scheduled"
                                }
                            ],
                            "allowClear": false
                        }
                    ],
                    "maxWidth": "70%"
                },
                {
                    "type": "panel",
                    "name": "panel2",
                    "elements": [
                        {
                            "type": "text",
                            "defaultValue": "-",
                            "name": "__res__price",
                            "title": "Price",
                            "readOnly": true
                        },
                        {
                            "type": "text",
                            "defaultValue": "-",
                            "name": "__res__delivery",
                            "title": "Delivery",
                            "readOnly": true
                        }
                    ],
                    "startWithNewLine": false,
                    "maxWidth": "30%"
                },
                {
                    "type": "file",
                    "name": "files",
                    "title": "Upload File",
                    "storeDataAsText": false,
                    "allowMultiple": true,
                    "maxSize": 102400,
                    "address": "https://api.surveyjs.io/public/v1/Survey/upload/"
                }
            ]
        }
    ],
    "showQuestionNumbers": "off"
    
}


export default surveyJson;