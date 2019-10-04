/*
* Author: Jack Kilrain
* Version: 2.1
* Licensing: All Rights Reserved
* Language: JavaScript (ES6)
*
* Description: Qubit representation and assosciated logic gates
*/

const one = [0,1];
const zero = [1,0];
const posi = math.complex('0+1');
const negi = math.complex('0-1');

// Check if the method already exists
if(Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals");

// Add the equals() function/method to the prototype of array
Array.prototype.equals = function (array) {
  // Return false if the argument is not an array
  if (!array) return false;

  // Return false if the array lengths are different
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if there are nested arrays and apply recursion to them
    if ((this[i] instanceof Array) && (array[i] instanceof Array)) {
      if (!this[i].equals(array[i])) return false;
    // Check if there are two object instances
    } else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

Object.defineProperty(Array.prototype, "equals", {enumerable: false});

const fillRange = (start, end) => {
  return Array(end - start + 1).fill().map((item, index) => start + index);
};

class format {

  static evalBraKet(expression) {
    if (typeof expression !== "string") {
      // Check if the expression is not a string and throw an error
      // Only strings can be evalutated
      throw new Error(`Error: Expression must be of type String`);
    } else {
      var eval_exp = new Array();
      // Remove any of the syntactic sugar from the Bra-Ket notation
      var expr = expression.replace(/^\|/, '').replace(/>$/, '');
      // Iterate through the expression and convert '0' -> zero '1' -> one
      for (var i in expr) {
        if (expr.charAt(i) === '0') {
          eval_exp.push(zero);
        } else if (expr.charAt(i) === '1') {
          eval_exp.push(one);
        }
      }
      // Return an array of zero and one
      return eval_exp;
    }
  }

  static convetResultToString(expression) {
    return JSON.stringify(expression.values);
  }

}

class QC {

  constructor(values) {
    this.values = format.evalBraKet(values);
    this.ALL = fillRange(0, this.values.length - 1);

  }

  applyOperatorToBits(operation, bits) {
    if (Number.isInteger(bits)) {
      this.values[bits] = math.multiply(this.values[bits], operation);
      return this.values;
    } else if (Array.isArray(bits)) {
      if (this.ALL.equals(bits)) {
        this.values = this.values.map(val => math.multiply(val, operation));
      } else {
        for (var i in bits) {
          this.values[bits[i]] = math.multiply(this.values[bits[i]], operation);
        }
      }
      return this.values;
    } else {
      Error("Invalid type, must be Array or Number");
    }
  }

  applyControlledOperatorToBits(operation, cBits, tBits) {
    if (Number.isInteger(cBits) && Number.isInteger(tBits)) {
      if (this.values[cBits].equals(one)) {
        this.values[tBits] = math.multiply(this.values[tBits], operation);
      }
      return this.values;
    } else if (Array.isArray(cBits) || Array.isArray(tBits)) {
      if (this.ALL.equals(cBits)) {
        throw new Error("Error: Control bits cannot be ALL");
      } else if (this.ALL.equals(tBits)) {
        this.values = this.values.map(val => math.multiply(val, operation));
      } else {
        var isTrue = true;
        for (var i in cBits) {
          isTrue = isTrue && this.values[cBits[i]].equals(one);
        }
        if (isTrue) {
          this.values = this.applyOperatorToBits(operation, tBits);
        }
      }
      return this.values;
    } else {
      Error("Invalid type, must be Array or Number");
    }
  }

  X(bits) {
    this.paulix = [[0,1],
                  [1,0]];
    this.values = this.applyOperatorToBits(this.paulix, bits);
    return this;
  }

  Y(bits) {
    this.pauliy = [[0,negi],
                  [posi, 0]];
    this.values = this.applyOperatorToBits(this.pauliy, bits);
    return this;
  }

  Z(bits) {
    this.pauliz = [[1, 0],
                  [0, -1]];
    this.values = this.applyOperatorToBits(this.pauliz, bits);
    return this;
  }

  S(bits) {
    this.s = [[1,0],
              [0,posi]];
    this.values = this.applyOperatorToBits(this.s, bits);
    return this;
  }

  Sdagger(bits) {
    this.sdagger = [[1,0],
                    [0,negi]];
    this.values = this.applyOperatorToBits(this.sdagger, bits);
    return this;
  }

  sqrtx(bits) {
    this.sqrtx = math.multiply(0.5, [[posi, negi],
                                    [negi, posi]]);
    this.values = this.applyOperatorToBits(this.sqrtx, bits);
    return this;
  }

  phase(theta, bits) {
    this.phase = [[1, 0],
              [0, math.exp(math.multiply(posi, theta))]];
    this.values = this.applyOperatorToBits(this.phase, bits);
    return this;
  }

  T(bits) {
    this.t = [[1, 0],
              [0, math.exp(math.multiply(posi, (math.pi/4)))]];
    this.values = this.applyOperatorToBits(this.t, bits);
    return this;
  }

  Tdagger(bits) {
    this.t = [[1, 0],
              [0, math.exp(math.multiply(negi, (math.pi/4)))]];
    this.values = this.applyOperatorToBits(this.t, bits);
    return this;
  }

  H(bits) {
    this.h = math.multiply((1 / math.sqrt(2)), [[1, 1],
                                                [1, -1]]);
    this.values = this.applyOperatorToBits(this.h, bits);
    return this;
  }

  swap(firstBit, secondBit) {
    var cbit = this.values[firstBit];
    var tbit = this.values[secondBit];
    this.values[firstBit] = tbit;
    this.values[secondBit] = cbit;
    return this;
  }

  cnot(controlBits, targetBits) {
    this.not = [[0,1],
                [1,0]];
    this.values = this.applyControlledOperatorToBits(this.not, controlBits, targetBits);
    return this;
  }

  cswap(controlBits, targetBits) {
    if (targetBits.length != 2) throw new Error("Error: Must have 2 target bits");
    var isTrue = true;
    for (var i in controlBits) {
      isTrue = isTrue && this.values[controlBits[i]].equals(one);
    }
    if (isTrue) {
      this.values = this.swap(targetBits[0], targetBits[1]).values;
    }
    return this;
  }

  rx(theta, targetBits) {
    this.rx = [[math.cos(theta/2), math.multiply(negi, math.complex(math.sin(theta/2)))],
              [math.multiply(negi, math.complex(math.sin(theta/2))), math.cos(theta/2)]];
    switch (theta) {
      // Return the inverted qubit if theta is pi radians
      case math.pi:
        this.value = this.applyOperatorToBits([[0,1],[1,0]], targetBits);
        break;
      // Return the qubit if theta is 2*pi radians
      case (math.pi*2):
        this.values = this.values;
        break;
      // Apply the transformation to any other rotation
      default:
        this.values = this.applyOperatorToBits(this.rx, targetBits);
        break;
    }
    return this;
  }

  ry(theta, targetBits) {
    this.ry = [[math.cos(theta/2), math.multiply(-1, math.complex(math.sin(theta/2)))],
              [math.complex(math.sin(theta/2)), math.cos(theta/2)]];
    switch (theta) {
      // Return the inverted qubit if theta is pi radians
      case math.pi:
        this.values = this.applyOperatorToBits([[0,1],[1,0]], targetBits);
        break;
      // Return the qubit if theta is 2*pi radians
      case (math.pi*2):
        this.values = this.values;
        break;
      // Apply the transformation to any other rotation
      default:
        this.values = this.applyOperatorToBits(this.ry, targetBits);
        break;
    }
    return this;
  }

  rz(theta, targetBits) {
    this.rz = [[math.exp(math.multiply(math.complex('0-1i'), theta/2)), 0],
              [0, math.exp(math.multiply(math.complex('0+1i'), theta/2))]];
    this.values = this.applyOperatorToBits(this.rz, targetBits);
    return this;
  }

  // Return a formatted version of the q-register, preserving brackets and notation
  getValues() {
    return format.convetResultToString(this);
  }

  normalise(bits) {
    for (var i in bits) {
      bits[i] = Math.pow(bits[i], 2);
    }
    return bits;
  }

  measure(bits) {
    for (var i in bits) {
      var cVal = this.normalise(this.values[i]);
      if (Math.random(0, 1) <= cVal[0]) {
        this.values[i] = zero;
      } else {
        this.values[i] = one
      }
    }
    return this;
  }
}
