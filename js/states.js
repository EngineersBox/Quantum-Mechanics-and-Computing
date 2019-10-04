/*
* Author: Jack Kilrain
* Version: 1.2
* Licensing: All Rights Reserved
* Language: JavaScript
*
* Description: Qubit representation and assosciated logic gates
*/

const math = require('mathjs')

class mathFunc {

  normaise(value, proportion) {
    return Math.abs(value) ** proportion
  }

}

class QC {

  constructor() {

  }

  newBits(values, qubitRegisterCount, classicalRegisterCount) {

    if (typeof(classicalRegisterCount) == 'undefined') classicalRegisterCount = qubitRegisterCount
    if (Array.isArray(values) === false) throw `Error: invalid qbit values ${values}`

    // Create new quantum registers with bit sizes specified in function args
    this.qRegC = qubitRegisterCount
    this.cRegC = classicalRegisterCount

    // Assign bit values as an array and initialise the amplitude array
    this.mVal = values
    this.amplitudes = []
    // Calculate the limiting factor for each probability
    const n = Math.pow(2, this.qRegC)
    // Calculate the probability proportion (assuming equal probabilities)
    const prob = 1 / n
    // Iterate in a range matching the register sizes
    for (let i = 0; i < n; i++) {
      var cVal = 0;
      if (this.mVal[i] < 1) {
        // If the probability value is less than 1 (indeterminant) assign it a value of 0
        cVal = 0
      } else {
        // Otherwise give the proportionate probability
        cVal = 1 / this.mVal[i]
      }
      // Assign amplitudes equivalent to probability (later converted)
      this.amplitudes.push(cVal)
      console.log(prob)
    }

    // TODO: assign bit offsets
    this.offset = 0

    return this
  }

  measure() {
    // Initialise the measurement array
    this.measAmplitudes = []
    // TODO: bit shift bias from offset
    const shift = Math.pow(2, this.offset)

    // Iterate through the amplitudes, normalise and output each one
    for (let i = 0; i < this.amplitudes.length; i++) {
      this.measAmplitudes.push(mathFunc.normaise(this.amplitudes[i], 2))
      console.log(this.measAmplitudes[i])
    }

  }

}

const qc = new QC()

qc.newBits([1,0], 1).measure()
