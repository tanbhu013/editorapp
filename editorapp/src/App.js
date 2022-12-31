import { useEffect, useRef } from "react";
import * as React from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import Grid from "@mui/material/Grid";
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import Button from '@mui/material/Button';
import { useState } from "react";
import axios from 'axios';
import CodeMirror from "@uiw/react-codemirror";

import io from 'socket.io-client';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'

import { w3cwebsocket as W3CWebSocket } from "websocket";


const myTheme = createTheme({
  theme: 'Dark',
  settings: {
    background: '#ffffff',
    foreground: '#75baff',
    caret: '#5d00ff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
    { tag: t.number, color: '#5c6166' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#5c6166' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});






export default function App() {

  const [language, setLanguage] = React.useState('');
  const [get, set] = useState("");
  const [output, setOutput] = useState("");
  const [runPayLoad, setRunPayLoad] = useState("");
  const [messages, setMessages] = useState([]);
  const HandlecodeOpen = (postURL) => {
    console.log(postURL);
  }

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };


  const RunJava = () =>{

    setMessages([]);

    

    var data = JSON.stringify({
      "language": "Java",
      "id":runPayLoad.id,
      "action":"run",
      "stream":true,
      "hasLtiData":false,
      "ltiData":{}

    });

    
    var config = {
      method: 'post',
      url: 'https://dev.vrbotz.com/'+runPayLoad.id,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        
        setRunPayLoad(response.data);

        var tempdata = response.data;
       
        var WSSURL = tempdata.stream.url;

        WSSURL.substr(WSSURL.indexOf("90/") + 2, WSSURL.length);
       
        var tempURL = "ws://13.127.175.82:9090" + WSSURL.substr(WSSURL.indexOf("90/") + 2, WSSURL.length);
     
        var startURL = tempdata.start.url;
       
        var tempStartURL = startURL.substr(startURL.indexOf("90/") + 2, startURL.length);
     
        const client = new W3CWebSocket(tempURL);

        client.onopen = () => {

          console.log('WebSocket Client Connected' + tempStartURL);

          var config = {
            method: 'post',
            url: 'https://dev.vrbotz.com' + tempStartURL,
            headers: {
              'Cookie': 'CoboMantraId=m00p868kjq8nh0llso167s9d2rg8kwr1nqmmem4q'
            }
          };

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });


        };
        client.onmessage = (message) => {

          message.data.text().then((text) => {

            setMessages((messages) => [...messages, text]);


          });
        };

     })
      .catch(function (error) {
        console.log(error);
      });


  };

  const RunNow = () => {

    setMessages([]);

    

    var data = JSON.stringify({
      "language": "Python",
      "files": [
        {
          "filename": "Root/main.py",
          "content": get
        },
        {
          "filename": "Root/codeboard.json",
          "content": "{\n\t\"MainFileForRunning\": \"main.py\",\n\t\"MainClassForRunning\":\"Application\"\n}"
        }
      ],
      "action": "compile",
      "stream": true
    });

    
    var config = {
      method: 'post',
      url: 'https://dev.vrbotz.com',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        
        setRunPayLoad(response.data);

        var tempdata = response.data;
      
        var WSSURL = tempdata.stream.url;

        WSSURL.substr(WSSURL.indexOf("90/") + 2, WSSURL.length);

        
        var tempURL = "ws://13.127.175.82:9090" + WSSURL.substr(WSSURL.indexOf("90/") + 2, WSSURL.length);
        
        var startURL = tempdata.start.url;
        
        var tempStartURL = startURL.substr(startURL.indexOf("90/") + 2, startURL.length);
        
        const client = new W3CWebSocket(tempURL);


        client.onopen = () => {
          console.log('WebSocket Client Connected' + tempStartURL);

          var config = {
            method: 'post',
            url: 'https://dev.vrbotz.com' + tempStartURL,
            headers: {
              'Cookie': 'CoboMantraId=m00p868kjq8nh0llso167s9d2rg8kwr1nqmmem4q'
            }
          };

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });


        };
        client.onmessage = (message) => {

          console.log(message);
          console.log(JSON.stringify(message));
          message.data.text().then((text) => {
        
            console.log(text);
            setMessages((messages) => [...messages, text]);

          });
        };


      })
      .catch(function (error) {
        console.log(error);
      });




  }

  function ListItem(props) {
    // Correct! There is no need to specify the key here:
    return <li>{props.value}</li>;
  }


  function OutputList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) =>
      // Correct! Key should be specified inside the array.
      <ListItem key={number.toString()}
        value={number} />
    );
    return (
      <ul style={{ listStyleType: 'decimal' }}>
        {listItems}
      </ul>
    );
  }


  const Compiple = () => {

    setMessages([]);
    console.log(JSON.stringify(get));

    var data = JSON.stringify({
      "language": "Java",
      "files": [
        {
          "filename": "Root/Application.java",
          "content": get
        },
        {
          "filename": "Root/codeboard.json",
          "content": "{\n\t\"MainFileForCompilation\": \"Application.java\",\n\t\"MainClassForRunning\":\"Application\"\n}"
        }
      ],
      "action": "compile",
      "stream": true
    });

    
    var config = {
      method: 'post',
      url: 'https://dev.vrbotz.com',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'CoboMantraId=m00p868kjq8nh0llso167s9d2rg8kwr1nqmmem4q'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setRunPayLoad(response.data);
        var tempdata = response.data;
        
        var WSSURL = tempdata.stream.url;
        WSSURL.substr(WSSURL.indexOf("90/") + 2, WSSURL.length);
        
        var tempURL = "ws://13.127.175.82:9090" + WSSURL.substr(WSSURL.indexOf("90/") + 2, WSSURL.length);
        

        var startURL = tempdata.start.url;
        console.log("startURL:");
        console.log(startURL);

        var tempStartURL = startURL.substr(startURL.indexOf("90/") + 2, startURL.length);
        //setPostURL(tempStartURL);

        const client = new W3CWebSocket(tempURL);


        client.onopen = () => {

          console.log('WebSocket Client Connected' + tempStartURL);

          var config = {
            method: 'post',
            url: 'https://dev.vrbotz.com' + tempStartURL,
            headers: {
              'Cookie': 'CoboMantraId=m00p868kjq8nh0llso167s9d2rg8kwr1nqmmem4q'
            }
          };

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });


        };
        client.onclose = function () {
          console.log('echo-protocol Client Closed');

        };


        client.onmessage = (message) => {


          message.data.text().then((text) => {
            console.log(text);

            setMessages((messages) => [...messages, text]);



            //  setOutput(messages.join("\n"));


          });
          setOutput(messages.join("\n"));
        };




      })
      .catch(function (error) {
        console.log(error);
      });



  };

  return (
    <>
      <Grid container width="100%" spacing={4} columns={12} sx={{ padding: 1, marginLeft: 0 }} >
        <Grid item lg={6} md={6} sm={6} xs={6}  >
          <FormControl sx={{ m: 0, minWidth: 180 }} size="small" variant="standard" >
            <InputLabel id="demo-simple-select-autowidth-label">Select Language</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={language}
              onChange={handleChange}
              autoWidth
              label="Language"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Java">Java</MenuItem>
              <MenuItem value="Python">Python</MenuItem>

            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container width="100%" spacing={4} columns={12} sx={{ padding: 1, marginLeft: 0 }} >
        <Grid item lg={6} md={6} sm={6} xs={6}  >
          <p1>Enter your code here:</p1>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}  >
          <p1>The output is:</p1>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}  >
          <CodeMirror
            value={get}
            height="400px"
            // extensions={[
            //   markdown({ base: markdownLanguage, codeLanguages: languages }),[javascript()]
            // ]},
            // extensions = {[python()]}
            theme={okaidia}
            extensions={[java({ jsx: true }), python({ jsx: true })]}
            onChange={(value) => set(value)}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}  >

          <OutputList numbers={messages} style={{ color: 'black', backgroundColor: '#cccc' }} />
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3}  >
          <Button variant="contained" onClick={() => Compiple()} variant="outlined"  disabled={language == "Python"}>Compiple</Button> &nbsp;
          <Button variant="contained" onClick={() => {
            if(language=="Java") RunJava();
            else RunNow();
          } } variant="outlined">Run</Button>

        </Grid>




      </Grid>
    </>
  );
}