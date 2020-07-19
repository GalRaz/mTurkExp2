/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);


// predefine shuffle function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  var experiment_time = 300000;
   var timeline = [];

   var id_check = {
     type: 'survey-text',
     questions: [
    {prompt: "<p> Enter your Prolific ID: </p>",
    button_label: 'Continue',
    data: {test_part: 'id_check'}
 }

 timeline.push(id_check);

   var bot_test = {
     type: 'survey-text',
     questions: [
    {prompt: "<p> To check that you're not a bot: </p>" +
    "<p> What do you see? Describe the shape & color with two words, separated by a comma. </p>", required: true}],
    preamble: '<img src="/static/images/shape.png"></img>',
    button_label: 'Continue',
    data: {test_part: 'botcheck'}
 }
   timeline.push(bot_test);


     // define instructions trial
     var instructions = {
       type: 'html-button-response',
       stimulus: "<p> <i> Thank you for participating in our experiment!  </i> </p>" +
            "<p> This session will last for 5min. <b> Please complete it in full screen mode. </b> </p>" +
           "<p> Do this experiment in one go, otherwise it will time out and we will </p>" +
           "<p> not be able to pay you. </p> ",
       choices: ['Continue'],
       post_trial_gap: 1000,
       data: {test_part: 'instructions'},
     };
     timeline.push(instructions);


     // define instructions trial
     var instructions = {
       type: 'html-button-response',
       stimulus: "<p> In each trial, you will see sequences of icons appearing one-by-one. </p>" +
           "<p> <b> Your task is very easy: Watch the icons closely, and for as long as you like.  </b> </p>" +
           "<p> Whenever you lose interest in the sequence, press space bar to see the next one. </p>",
      choices: ['Continue'],
       post_trial_gap: 1000,
       data: {test_part: 'instructions'},
     };
     timeline.push(instructions);
     var instructions = {
       type: 'html-button-response',
       stimulus: "<p> To re-iterate: Your task is simply to watch the icons, </p>" +
       "<p> and press the space bar whenever you want to move on. </p>" +
       "<p> The experiment will end automatically after 5 minutes. </p>" +
       "<p> <b> Please, maintain your attention during the experiment. </b> </p>" +
       "<p> You may encounter little, unexpected tests during the experiment, </p>" +
       "<p>  to make sure you are paying attention. </p>",
       choices: ['Continue'],
       post_trial_gap: 1000,
       data: {test_part: 'instructions'},
       on_finish: function() {
       // get trial data
       var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
       // convert to dictionary and get time elapsed
       var time_elapsed = JSON.parse(trialstring)["time_elapsed"];
       window.startTime = time_elapsed
      }
     };
     timeline.push(instructions);


       var between_sequences = {
         type: 'html-keyboard-response',
         stimulus: "Next sequence coming up..",
         trial_duration: 3500,
         choices: jsPsych.NO_KEYS,
         data: {test_part: 'between_sequences'},
         on_start: function() {
         // get trial data
         var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
         // convert to dictionary and get time elapsed
         var time_elapsed = JSON.parse(trialstring)["time_elapsed"];
         // get time
         var startTime = jsPsych.data.get().last(1).values()[0].startTime

         console.log(time_elapsed)
         console.log(window.startTime)

         if (time_elapsed - window.startTime > experiment_time) {
           jsPsych.endExperiment()
       }
     },
   on_finish: function(){
     // get trial data
     var trialstring = jsPsych.data.getLastTrialData().json().split('[').join('').split(']').join('');
     // convert to dictionary and get time elapsed
     var time_elapsed = JSON.parse(trialstring)["time_elapsed"];

     var startTime = jsPsych.data.get().last(1).values()[0].startTime

     if (time_elapsed - window.startTime > experiment_time)
     {
        jsPsych.endExperiment()
   }
 }
};

     var data2;
     var msg = $.ajax({type: "GET",
     url: "https://raw.githubusercontent.com/sradkani/CoCoSci/master/Experiment2/slideseqs.csv",
      async: false}).responseText;

     data2 = Papa.parse(msg)
     data2 = data2['data']

     shuffle(data2)

     var data2 = Object.values(data2);

     function csvValues(){
       var arrayLength = data2.length;

         for (var i = 0; i < arrayLength; i++) {
           var test_stimuli = []
             for (var j = 0; j < data2[i].length - 1; j++) {

// '<div style="font-size:65px;">  <p> </p>' + Object.values(data2[i][j]).toString().replace(/,/g, '  ') + '</div>

           test_stimuli.push({stimulus: '<img src="/static/images/icons/' + Object.values(data2[i][j]).toString().replace(/,/g, '')  + '.png"></img>' , data: {test_part: 'training', next_elem: data2[i][j+1]}})
       }

       // sample from test_stimuli
        var symbol = {
          type: "html-keyboard-response",
          stimulus: jsPsych.timelineVariable('stimulus'),
          choices: jsPsych.ALL_KEYS,
          trial_duration: 900,
          post_trial_gap: 300,
          data: jsPsych.timelineVariable('data'),
          on_finish: function(symbol){
            var spacePressed = jsPsych.data.get().last(1).values()[0].key_press
          if(spacePressed == 32) {
            jsPsych.endCurrentTimeline();
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
          timeline: [sequence, between_sequences], //
        }
        timeline.push(questionnaire);

     }
   }
   csvValues()

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
        // save data
        psiturk.saveData({
            success: function() {
                // upon saving, add proportion correct as a bonus (see custom.py) and complete HIT
                    psiturk.completeHIT();
            }
        });
    },
});
