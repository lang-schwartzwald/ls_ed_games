// This function produces a json object of binary values from 1-255

function binaryUpTo(upTo)
{
    var binary;
    var maxI;
    var tempVar;
    var output_json = {};

    for (var i = 1; i <= upTo; i++)
    {
        //hold each i, so we can subtract from it later
        tempVar = i;

        //find the largest j s.t. 2^j<=tempVar
        for (var j = 0; Math.pow(2, j) <= tempVar; j++)
        {
            //set maxI equal to that largest j
            maxI = j;
        }

        //make an array called binnary with length of the maxI
        binary = new Array(maxI + 1);
        //set the first spot in the array to 1
        binary[binary.length - maxI - 1] = 1;
        //subtract 2^maxI from the tempvar
        tempVar -= Math.pow(2, maxI);
        //decrement maxI by one, so the index goes down and we can compare maxI^2 to tempVar
        maxI -= 1;

        while (maxI >= 0)
        {
            //is 2^maxI is <= tempVar then put a 1 in the next slot in the array
            if (Math.pow(2, maxI) <= tempVar)
            {
                binary[binary.length - maxI - 1] = 1;
                tempVar -= Math.pow(2, maxI);
            }
            else
            { //else put a 0 in the next slot in the array
                binary[binary.length - maxI - 1] = 0;
            }
            //decement maxI and repeat!
            maxI--;
        }

        var n = binary.join("");
        output_json[i] = ('00000000'+n).slice(-8);
    }
    return output_json;
}

//call function up to 255
var bytes = binaryUpTo(255);

$( document ).ready(function() {
	// Allow Enter key to submit answer
	$('input[name="answer"]').on('keydown', function(e) {
		if (e.key === 'Enter') {
			$('#submit_answer').click();
		}
	});
	// Track shown values for each bit count
	var shownValues = {};
	// Show binary values by default
	$('.binary_value').show();
	var hiddenValueCount = 0;
		var random_number, sequence;
		var bitCount = 2; // Start with 2 bits
		var correctAnswers = 0;
		var maxBits = 8; // Maximum bits allowed

		function createCards() {
			var container = $('#cards-container');
			container.empty();
			for (var i = 0; i < bitCount; i++) {
				var value = Math.pow(2, bitCount - i - 1);
				container.append(
					`<div class="binary_card" data-value="${value}">
						<div class="card"></div>
						<div class="binary_value" style="display:block;">${value}</div>
					</div>`
				);
			}
			// Show all values except those that should be hidden
			$('.binary_value').show();
			for (var i = 0; i < hiddenValueCount; i++) {
				$('.binary_value').eq(bitCount - i - 1).hide();
			}
		}

		if(bytes){
			console.log(bytes);
			// Initialize shownValues for starting bitCount
			if (!shownValues[bitCount]) {
				shownValues[bitCount] = new Set();
			}
			createCards();
			set_values();
		}
	// set number function
	function set_values() {
	// Always focus the input box after generating new values
	$('input[name="answer"]').focus();
		var cards = $('.card');
		var size = Math.pow(2, bitCount);
		// Initialize shownValues for current bitCount if needed
		if (!shownValues[bitCount]) {
			shownValues[bitCount] = new Set();
		}
		// Find a value that hasn't been shown yet
		var possibleValues = [];
		for (var i = 0; i < size; i++) {
			if (!shownValues[bitCount].has(i)) {
				possibleValues.push(i);
			}
		}
		// If all possible values have been shown, move to next bit count
		if (possibleValues.length === 0 && bitCount < maxBits) {
			bitCount++;
			if(hiddenValueCount < bitCount) {
				hiddenValueCount++;
			}
			createCards();
			// Initialize for new bitCount
			if (!shownValues[bitCount]) {
				shownValues[bitCount] = new Set();
			}
			// After increasing bitCount, re-run set_values but do not continue with old logic
			var sizeNew = Math.pow(2, bitCount);
			var possibleValuesNew = [];
			for (var i = 0; i < sizeNew; i++) {
				if (!shownValues[bitCount].has(i)) {
					possibleValuesNew.push(i);
				}
			}
			random_number = possibleValuesNew[Math.floor(Math.random() * possibleValuesNew.length)];
			shownValues[bitCount].add(random_number);
			sequence = bytes[random_number];
			// If sequence is undefined, set sequenced to all zeros
			var sequenced;
			if (typeof sequence === 'undefined' || sequence === undefined) {
				sequenced = Array(bitCount).fill('0');
			} else {
				sequenced = sequence.slice(-bitCount).split("");
			}
			// Robust check: If sequence, random_number, or any binary digit is undefined, regenerate values
			let valid = true;
			if (typeof sequence === 'undefined' || sequence === undefined) valid = false;
			if (typeof random_number === 'undefined' || random_number === undefined) valid = false;
			if (!sequenced || sequenced.length !== bitCount) valid = false;
			for (let i = 0; i < bitCount; i++) {
				if (typeof sequenced[i] === 'undefined' || sequenced[i] === undefined) valid = false;
			}
			if (!valid) {
				// If invalid, show all bits as 0
				$('.binary_card').each(function(index){
					if(index < bitCount){
						$(this).show();
						var card = $(this).find('.card');
						card.addClass('off');
						card.text('0');
					}else{
						$(this).hide();
					}
				});
				return;
			}
			$('.binary_card').each(function(index){
				if(index < bitCount){
					$(this).show();
					var binary_digit = sequenced[index];
					var card = $(this).find('.card');
					if(binary_digit == "0"){
						card.addClass('off');
					}else{
						card.removeClass('off');
					}
					card.text(binary_digit);
				}else{
					$(this).hide();
				}
			});
			return;
		}
		// Pick a random value from possibleValues
		random_number = possibleValues[Math.floor(Math.random() * possibleValues.length)];
		shownValues[bitCount].add(random_number);
		sequence = bytes[random_number];
		var sequenced;
		if (typeof sequence === 'undefined' || sequence === undefined) {
			sequenced = Array(bitCount).fill('0');
		} else {
			sequenced = sequence.slice(-bitCount).split("");
		}
		let valid2 = true;
		if (typeof sequence === 'undefined' || sequence === undefined) valid2 = false;
		if (typeof random_number === 'undefined' || random_number === undefined) valid2 = false;
		if (!sequenced || sequenced.length !== bitCount) valid2 = false;
		for (let i = 0; i < bitCount; i++) {
			if (typeof sequenced[i] === 'undefined' || sequenced[i] === undefined) valid2 = false;
		}
		if (!valid2) {
			// If invalid, show all bits as 0
			$('.binary_card').each(function(index){
				if(index < bitCount){
					$(this).show();
					var card = $(this).find('.card');
					card.addClass('off');
					card.text('0');
				}else{
					$(this).hide();
				}
			});
			return;
		}
		$('.binary_card').each(function(index){
			if(index < bitCount){
				$(this).show();
				var binary_digit = sequenced[index];
				var card = $(this).find('.card');
				if(binary_digit == "0"){
					card.addClass('off');
				}else{
					card.removeClass('off');
				}
				card.text(binary_digit);
			}else{
				$(this).hide();
			}
		});
	}
	// Timer
	var seconds = 0;
	var tens = 0;
	var appendTens = document.getElementById("tens");
	var appendSeconds = document.getElementById("seconds");
	var buttonStart = document.getElementById('button-start');
	var buttonStop = document.getElementById('button-stop');
	var buttonReset = document.getElementById('button-reset');
	var Interval ;
	
	buttonStart.onclick = function() {
		clearInterval(Interval);
		Interval = setInterval(startTimer, 10);
	}
	
	buttonStop.onclick = function() {
		clearInterval(Interval);
	}

	buttonReset.onclick = function() {
		clearInterval(Interval);
	tens = 0;
	seconds = 0;
	appendTens.innerHTML = "00";
	appendSeconds.innerHTML = "00";
	}

  function startTimer () {
	  
    tens++; 
    
    if(tens < 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
  }
  
  var correct, total_time, speed;
  var won = $('#won span');
  setInterval(function(){
	correct = parseInt(won.text());
	total_time = seconds + (tens/100);
	speed = correct/total_time; 
	if(isNaN(speed) || !isFinite(speed)) {
		speed = 0;
	}
	$('#bits_per_second').text(speed.toFixed(3) + " bits per second");
  }, 100);
	
	
	// add events for each button
	$('#new_values').on('click', function (){
		set_values();
		// Place input field into focus
		$('input[name="answer"]').focus();
	});
	
	$('#toggle_binary_values').on('click', function(){
		$('.binary_value').toggle();
	});
	
	$('#submit_answer').on('click', function(){
		// Automatically start timer if not running
		if (!Interval) {
			clearInterval(Interval);
			Interval = setInterval(startTimer, 10);
		}
		var user_input = $('input').val();
		$('input').val('');
		// Only allow answers within the range for current bitCount
		var maxValue = Math.pow(2, bitCount) - 1;
		if(Number(user_input) === random_number && Number(user_input) <= maxValue){
			$('#message').text("Congratulations! "+sequence+" is equal to "+user_input+"!");
			$('#message').removeClass();
			$('#message').addClass('green');
			var total = $('#won span').text();
			total = parseInt(total);
			total++;
			$('#won span').text(total);
			correctAnswers++;
			if(correctAnswers % 5 === 0 && bitCount < maxBits){
				bitCount++;
				if(hiddenValueCount < bitCount) {
					hiddenValueCount++;
				}
				createCards();
			}
		}else{
			$('#message').text("Sorry... "+sequence+" is not equal to "+user_input+", please try again.");
			$('#message').removeClass();
			$('#message').addClass('red');
			var total = $('#lost span').text();
			total = parseInt(total);
			total++;
			$('#lost span').text(total);
		}
	set_values();
	// Focus input box again after answer is processed
	$('input[name="answer"]').focus();
			
	});
});