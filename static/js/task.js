/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);


// predefine shuffle function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

   var timeline = [];

     // define instructions trial
     var instructions = {
       type: 'html-button-response',
       stimulus: "<p>This session will last for 15min.</p>" +
           "<p> In each trial, you will see some letters (A, B or C) appearing one-by-one. </p>" +
           "<p> You will be asked to stop the sequence by pressing the spacebar. </p>" +
           "<p> Some sequences you will see have some structure, and some don't. </p>" +
           "<p> Your task is to stop the sequence whenever you feel like you can predict </p>" +
           "<p> the next letter or when you feel like there is no structure </p>" +
           "<p> and the sequence is unpredictable. </p>" +
           "<p> Sequences are generated independently from each other. </p>"  +
           "<p> <br /> Let us practice before we move on to the actual experiment. </p> <br />",
           choices: ['Continue'],

       post_trial_gap: 1000
     };
     timeline.push(instructions);

     var instructions = {
       type: 'html-button-response',
       stimulus: "<p> Remember: Some sequences will be very predictable, some will be somewhat predictable, while others will have no structure at all. </p>" +
       "<p> Stop the sequence by pressing the spacebar whenever you feel you can predict the next letter, or you decide that the sequence is unpredictable. </p>",
           choices: ['Continue'],

       post_trial_gap: 1000
     };
     timeline.push(instructions);

       var multi_choice_options = ["A","B","C","Equally likely"];
       var multi_choice_block = {
         type: 'survey-multi-choice',
         questions: [
           {prompt: "Which letter is most likely to appear NEXT?", options: multi_choice_options, required:true}
         ],
       };

       var feedback = {
       type: 'html-button-response',
       stimulus: "",
       choices: ['Continue'],
       on_start: function(feedback) {
         var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
         var response = JSON.parse(trialstring)["responses"][7];
         console.log(response)
         var next_elem = jsPsych.data.get().last(4).values()[0].next_elem
         if (next_elem == response){
           feedback.stimulus = "Correct!"
         }
         else if (response == "E"){
             feedback.stimulus = ""
           }
         else{
           feedback.stimulus = "Incorrect!"+
           "<p> The correct choice was: " + next_elem
         }
         }
         }

     var data2;
     var msg = $.ajax({type: "GET",
     url: "https://raw.githubusercontent.com/ashtishah/CoCoSci/master/Experiment/sequencesTrial.csv",
      async: false}).responseText;

     data2 = Papa.parse(msg)
     data2 = data2['data']

     var data2 = Object.values(data2);

     var next_trial;

     function csvValues(){
       var arrayLength = data2.length;

         for (var i = 0; i < arrayLength; i++) {
           var test_stimuli = []
             for (var j = 0; j < data2[i].length - 1; j++) {

           next_trial = data2[i][j+1];

           test_stimuli.push({stimulus: '<div style="font-size:65px;">  <p> </p>' +
           Object.values(data2[i][j]).toString().replace(/,/g, '  ') +
           '</div>', data: {test_part: 'training', next_elem: data2[i][j+1]}})
       }

       // sample from test_stimuli
        var symbol = {
          type: "html-keyboard-response",
          stimulus: jsPsych.timelineVariable('stimulus'),
          choices: jsPsych.ALL_KEYS,
          trial_duration: 800,
          post_trial_gap: 300,
          data: jsPsych.timelineVariable('data'),
          on_start: function(symbol){
            var spacePressed = jsPsych.data.get().last(1).values()[0].key_press
          if(spacePressed == 32) {
            symbol.stimulus = "";
            symbol.trial_duration = 0;
            symbol.post_trial_gap = 0;
            jsPsych.endCurrentTimeline()
          }

          // get trial data
          var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
          // convert to dictionary and get time elapsed
          var time_elapsed = JSON.parse(trialstring)["time_elapsed"];
          // end experiment after 12min
          if (time_elapsed > 720000) {
            var end_exp = {
              type: 'html-button-response',
              stimulus: "<p> Thank you for completing this experiment </p>",
              choices: ['Exit']
            }
            timeline.push(end_exp);
            jsPsych.endExperiment()
          }
        }
      }

        /* define sequence procedure */
        var sequence = {
          timeline: [symbol],
          timeline_variables: test_stimuli,
        }

        // define questionnaire procedure
        var questionnaire = {
          timeline: [sequence, multi_choice_block, feedback], //
        }
        timeline.push(questionnaire);

     }
   }
   csvValues()

   var data4;
   var msg = $.ajax({type: "GET",
   url: "https://raw.githubusercontent.com/ashtishah/CoCoSci/master/Experiment/sequencesTrial2.csv",
   async: false}).responseText;

   data4 = Papa.parse(msg)
   data4 = data4['data']

   var data4 = Object.values(data4);

   var next_trial;

   function csvValues3(){
   var arrayLength = data4.length;

     for (var i = 0; i < arrayLength; i++) {
       var test_stimuli = []
         for (var j = 0; j < data4[i].length - 1; j++) {

       next_trial = data4[i][j+1];

       test_stimuli.push({stimulus: '<div style="font-size:65px;">' +
       Object.values(data4[i][j]).toString().replace(/,/g, '  ') +
       '</div>', data: {test_part: 'training', next_elem: data4[i][j+1]}})
   }

   // sample from test_stimuli
    var symbol = {
      type: "html-keyboard-response",
      stimulus: jsPsych.timelineVariable('stimulus'),
      choices: jsPsych.ALL_KEYS,
      trial_duration: 800,
      post_trial_gap: 300,
      data: jsPsych.timelineVariable('data'),
      on_start: function(symbol){
        var spacePressed = jsPsych.data.get().last(1).values()[0].key_press
      if(spacePressed == 32) {
        symbol.stimulus = "";
        symbol.trial_duration = 0;
        symbol.post_trial_gap = 0;
        jsPsych.endCurrentTimeline()
      }

      // get trial data
      var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
      // convert to dictionary and get time elapsed
      var time_elapsed = JSON.parse(trialstring)["time_elapsed"];
      // end experiment after 12min
      if (time_elapsed > 720000) {
        var end_exp = {
          type: 'html-button-response',
          stimulus: "<p> Thank you for completing this experiment </p>",
          choices: ['Exit']
        }
        timeline.push(end_exp);
        jsPsych.endExperiment()
      }
    }
   }

    /* define sequence procedure */
    var sequence = {
      timeline: [symbol],
      timeline_variables: test_stimuli,
    }

    // define questionnaire3 procedure
    var questionnaire3 = {
      timeline: [sequence, multi_choice_block, feedback], //
    }
    timeline.push(questionnaire3);

   }
   }
   csvValues3()
   var begin_exp = {
   type: 'html-button-response',
   stimulus: "<p> You are now ready to proceed with the actual experiment. </p>",
   choices: ['Continue']
   };
   timeline.push(begin_exp)

 var data3;
 var msg = $.ajax({type: "GET",
 url: "https://raw.githubusercontent.com/sradkani/CoCoSci/master/Experiment2/sequencesTest.csv",
  async: false}).responseText;

 data3 = Papa.parse(msg)
 data3 = data3['data']

// remove last sequence (is empty)
 var data3 = Object.values(data3).slice(0, data3.length-1) ;

// shuffle data
shuffle(data3)

console.log(data3)

 var next_trial;

 function csvValues2(){
   var arrayLength = data3.length;

     for (var i = 0; i < arrayLength; i++) {
       var test_stimuli = []
         for (var j = 0; j < data3[i].length-1; j++) {

       next_trial = data3[i][j+1];

       test_stimuli.push({stimulus: '<div style="font-size:65px;">' +
       Object.values(data3[i][j]).toString().replace(/,/g, '  ') +
       '</div>', data: {test_part: 'test', next_elem: data3[i][j+1]}})
   }

   // sample from test_stimuli
    var symbol = {
      type: "html-keyboard-response",
      stimulus: jsPsych.timelineVariable('stimulus'),
      choices: jsPsych.ALL_KEYS,
      trial_duration: 800,
      post_trial_gap: 300,
      data: jsPsych.timelineVariable('data'),
      on_start: function(symbol){
        var spacePressed = jsPsych.data.get().last(1).values()[0].key_press
      if(spacePressed == 32) {
        symbol.stimulus = "";
        symbol.trial_duration = 0;
        symbol.post_trial_gap = 0;
        jsPsych.endCurrentTimeline()
      }

      // get trial data
      var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
      // convert to dictionary and get time elapsed
      var time_elapsed = JSON.parse(trialstring)["time_elapsed"];
      // end experiment after 12min
      if (time_elapsed > 360000) {
        var end_exp = {
          type: 'html-button-response',
          stimulus: "<p> Thank you for completing this experiment </p>",
          choices: ['Exit']
        }
        timeline.push(end_exp);
        jsPsych.endExperiment()
      }
    }
  }

    /* define sequence2 procedure */
    var sequence2 = {
      timeline: [symbol],
      timeline_variables: test_stimuli,
    }

    // define questionnaire2 procedure
    var questionnaire2 = {
      timeline: [sequence2, multi_choice_block, feedback], //
    }
    timeline.push(questionnaire2);

 }
}
csvValues2()

/* record id, condition, counterbalance on every trial */
jsPsych.data.addProperties({
    uniqueId: uniqueId,
    condition: condition,
    counterbalance: counterbalance
});

jsPsych.init({
    display_element: 'jspsych-target',
    timeline: timeline,
    // record data to psiTurk after each trial
    on_data_update: function(data) {
        psiturk.recordTrialData(data);
    },
    on_finish: function() {
        // record proportion correct as unstructured data

        // save data
        psiturk.saveData({
            success: function() {
                // upon saving, add proportion correct as a bonus (see custom.py) and complete HIT
                    psiturk.completeHIT();
            }
        });
    },
});
