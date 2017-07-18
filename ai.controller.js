var Model = require('./Model');
var synaptic = require('synaptic'); // this line is not needed in the browser
var Brain = require("./Brain");
var Brain2 = require("./Brain2");

var brain = require("brain")
var convnetjs = require("convnetjs")
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var myNetwork = new Architect.Perceptron(2, 20, 1)
var trainer = new Trainer(myNetwork)

exports.train = function(req, res) {
    var trainingSet = []
    var trainingSet2 = []
    var trainingSet3 = []
    var trainingSet4 = []
    var tX =[]
    var tY = [];
    Model.find({}, function(err, result) {
        console.log(result.length)
        var volumes = [];
        var outputs = [];
				var outputs2 = [];
        for (var i = 0; i < result.length; i++) {
            for (var x = 0; x < result[i].output.length; x++) {
                // console.log(result[i].input[x])
                var g = false
                if (result[i].output[x] > 1) {
                    g = true;

                }
                if (result[i].input[0] == 0) {
                    g = true;

                }
            }
            var r = result[i].output;
            var sum = 0;
            var hrSUm = 0;
            var hr = [r[1]+r[2]+r[3]];
            console.log(hr)
            console.log(r)
            if (hr[0] ==0)
            continue

            // result[i].input.splice(11,1)
            // result[i].input.splice(5,1)
            for (var z=0; z < result[i].input.length; z++){
              sum = result[i].input[1] +result[i].input[2]+result[i].input[3]+result[i].input[7]+result[i].input[8]+result[i].input[9];
              hrSUm += (result[i].input[3]+result[i].input[9])
            }
            if (result[i].input[0] != 0 || result[i].input[6] != 0 && g == false)
                trainingSet.push({
                    input: [sum],
                    output: hr
                })

              for (var j=0; j < result[i].input.length; j++) {
                if (isNaN(result[i].input[j]))
                 result[i].input[j] = 0;

              }
            // var x = new convnetjs.Vol([result[i].input[0], result[i].input[1], result[i].input[2], result[i].input[3], result[i].input[4], result[i].input[5], result[i].input[6], result[i].input[7], result[i].input[8], result[i].input[9], result[i].input[10], result[i].input[11]]);
            var x= new convnetjs.Vol([sum])
            var y = new convnetjs.Vol(hr);
            tX.push([sum])
            tY.push(hr)
            volumes.push(x)
            // console.log(trainingSet)


            outputs.push(hr)

						outputs2.push(r)

            trainingSet2.push({
                input: [result[i].input[0], result[i].input[1], result[i].input[2], result[i].input[3], result[i].input[4], result[i].input[5], result[i].input[6], result[i].input[7], result[i].input[8], result[i].input[9], result[i].input[10], result[i].input[11]],
                output: hr
            })

            so = 0;
            if (result[i].output[5] > 0)
                so = 1;

            trainingSet3.push({
                input: [result[i].input[5], result[i].input[11]],
                output: [result[i].output[5]]
            })

            w = 0;
            if (result[i].output[4] > 0)
                w = 1;

            trainingSet4.push({
                input: [result[i].input[4], result[i].input[10]],
                output: [result[i].output[4]]
            })
        }
        // console.log(trainingSet)
        // console.log(train)
        //       var trainingSet = [
        //   {
        //     input: [0,0],
        //     output: [0]
        //   },
        //   {
        //     input: [0,1],
        //     output: [1]
        //   },
        //   {
        //     input: [1,0],
        //     output: [1]
        //   },
        //   {
        //     input: [1,1],
        //     output: [0]
        //   },
        // ]
        // trainingSet = [{
        // 	input: [.25,0,0,0.25,.25,.2,0,0,.25,0],
        // 	output:[1,0,0,1,1]
        // },
        // {input: [.25,0,0,0.25,.25,.2,0,0,.25,0],
        // output:[.25,0,0,.25,.25]},
        // {input: [.1,0,0,0.25,.1,.1,0,0,.25,0],
        // output:[0,0,0,0,0]
        // },{
        // input: [.350,0,0,0.25,.25,.1,0,0,.25,0],
        // output:[1,0,0,1,0]}
        // ]
        // console.log(trainingSet)
        // trainer.train(trainingSet,{
        // 	rate: .3,
        // 	iterations: 1000,
        // 	error: .005,
        // 	shuffle: true,
        // 	log: 1000,
        // 	cost: Trainer.cost.CROSS_ENTROPY
        // });
        // var inputLayer = new Layer(2);
        // var hiddenLayer = new Layer(30);
        // var outputLayer = new Layer(1);
        //
        // inputLayer.project(hiddenLayer);
        // hiddenLayer.project(outputLayer);
        //
        // var myNetwork = new Network({
        // 	input: inputLayer,
        // 	hidden: [hiddenLayer],
        // 	output: outputLayer
        // });
        //
        // // train the network
        // var learningRate = .9;
        // for (var i = 0; i < trainingSet.length; i++)
        // {
        // 	var k =trainingSet[i]
        // 	// 0,0 => 0
        // 	myNetwork.activate(k.input);
        // 	myNetwork.propagate(learningRate, k.output);
        //
        // 	// 0,1 => 1
        // 	myNetwork.activate(k.input);
        // 	myNetwork.propagate(learningRate, k.output);
        //
        // 	// 1,0 => 1
        // 	myNetwork.activate(k.input);
        // 	myNetwork.propagate(learningRate, k.output);
        //
        // 	// 1,1 => 0
        // 	myNetwork.activate(k.input);
        // 	myNetwork.propagate(learningRate, k.output);
        // 	// console.log(k.output-myNetwork.activate(k.input))
        // }
        var layer_defs = [];
        layer_defs.push({
            type: 'input',
            out_sx: 1,
            out_sy: 1,
            out_depth: 12
        });
        layer_defs.push({
            type: 'fc',
            num_neurons: 20,
            activation: 'relu'
        });
        layer_defs.push({
            type: 'regression',
            num_classes: 1
        });
        var net = new convnetjs.Net();
        net.makeLayers(layer_defs);
				var layer_defs = [];

        layer_defs.push({
            type: 'input',
            out_sx: 1,
            out_sy: 1,
            out_depth: 1
        });
        layer_defs.push({
            type: 'fc',
            num_neurons: 1,
            activation: 'sigmoid'
        });
        layer_defs.push({
            type: 'regression',
            num_neurons: 2
        });
        var net2 = new convnetjs.Net();
				net2.makeLayers(layer_defs);


        var trainer = new convnetjs.SGDTrainer(net, {
            learning_rate: 0.01,
            momentum: 0.0,
            batch_size: 1,
            l2_decay: 0.001
        });
        console.log(volumes.length)
        var trainer2 = new convnetjs.SGDTrainer(net2, {
            learning_rate: 0.01,
            momentum: 0.0,
            batch_size: 1,
            l2_decay: 0.001
        });
        for (var x = 0; x < 1; x++) {
            for (var i = 0; i < volumes.length; i++) {
                trainer.train(volumes[i], outputs[i]);
								var predicted_values = net.forward(volumes[i]);
                if (isNaN(predicted_values.w[0])){
                    console.log(volumes[i], outputs[i])
                          //  return true;

                         }

								console.log('predicted value 1: ' + predicted_values.w);

            }
        }
        // for (var x = 0; x < 1; x++) {
        //     for (var i = 0; i < volumes.length; i++) {
        //         trainer2.train(volumes[i][0], outputs2[i]);
				// 				var predicted_values = net2.forward(volumes[i][0]);
				// 				console.log('predicted value: ' + predicted_values.w);
        //
        //
        //     }
        // }
        // evaluate 'uuon a datapoint. We will get a 1x1x1 Vol back, so we get the
        // actual output by looking into its 'w' field:

        var json = net2.toJSON();
        // the entire object is now simply string. You can save this somewhere
        var str = JSON.stringify(json);

        var newB = new Brain2({
            hr: str
        })

        newB.save();
        var net = new brain.NeuralNetwork();
        var net2 = new brain.NeuralNetwork();
        var net3 = new brain.NeuralNetwork();
        var net4 = new brain.NeuralNetwork();

        console.log("training")
        net.train(trainingSet, {
            errorThresh: 0.005, // error threshold to reach
            iterations: 1000, // maximum training iterations
            log: true, // console.log() progress periodically
            logPeriod: 10, // number of iterations between logging
            learningRate: 0.9
        })
         console.log(net.run(trainingSet[0].input))
        net2.train(trainingSet2, {
            errorThresh: 0.005, // error threshold to reach
            iterations: 1, // maximum training iterations
            log: true, // console.log() progress periodically
            logPeriod: 10, // number of iterations between logging
            learningRate: 0.1
        })
        net3.train(trainingSet3, {
            errorThresh: 0.005, // error threshold to reach
            iterations: 1, // maximum training iterations
            log: true, // console.log() progress periodically
            logPeriod: 10, // number of iterations between logging
            learningRate: 0.1
        })
        net4.train(trainingSet4, {
            errorThresh: 0.005, // error threshold to reach
            iterations: 1, // maximum training iterations
            log: true, // console.log() progress periodically
            logPeriod: 10, // number of iterations between logging
            learningRate: 0.1
        })
      //   for (var j =0; j < trainingSet.length; j++){
      //   console.log("RUN",net.run(trainingSet[j].input))
      // }
        net.toJSON()
        net2.toJSON()
        net3.toJSON()
        net4.toJSON()

        var ml = require('machine_learning');


        var classifier = new ml.LogisticRegression({
            'input' : tX,
            'label' : tY,
            'n_in' : 1,
            'n_out' : 1
        });

        classifier.set('log level',1);

        var training_epochs = 800, lr = 0.01;

        classifier.train({
            'lr' : lr,
            'epochs' : training_epochs
        });

        var t = []
        var g = classifier.predict(tX);

        Brain.find({}, function(err, stuff) {
            if (stuff.lenth > 0) {
                Brain.update({}, {
                    hit: net,
                    hr: net2,
                    so: net3,
                    w: net4
                }, function(err, seb) {
                    // if (err)
                    // res.send(err)

                    // res.send(seb)

                })
            } else {
                var brain = new Brain({
                    hit: JSON.stringify(net.toJSON()),
                    hr: JSON.stringify(net2.toJSON()),
                    so: JSON.stringify(net3.toJSON()),
                    w: JSON.stringify(net4.toJSON()),
                    tX :tX,
                    tY:tY
                })

                brain.save(function(e, s) {
                    // if (e)
                    // res.send(e)

                    // res.send(s)
                })
            }
        })



        Brain.find({}, function(err, brain) {
            brain = brain[0]
            // var myNetwork = Network.fromJSON(brain.json)

            // trainer.train(train);
            // trainer.test(train)
            // res.send(trainer);

            // })
        })
    })
}
