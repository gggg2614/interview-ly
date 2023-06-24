class Commitment {
  static PENDING = "pedding";
  static FULFILLED = "fullfilled";
  static REJECTED = "rejected";
  constructor(func) {
    this.status = Commitment.PENDING;
    this.result = null;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(result) {
    setTimeout(() => {
      if (this.status === Commitment.PENDING) {
        this.status = Commitment.FULFILLED;
        this.result = result;
        this.resolveCallbacks.forEach((callback) => {
          callback(result);
        });
      }
    });
  }
  
  reject(result) {
    setTimeout(() => {
      if (this.status === Commitment.PENDING) {
        this.status = Commitment.REJECTED;
        this.result = result;
        this.resolveCallbacks.forEach((callback) => {
          callback(result);
        });
      }
    });
  }
  then(onFULFIILED, onREJECTED) {
    onFULFIILED = typeof onFULFIILED === "function" ? onFULFIILED : () => {};
    onREJECTED = typeof onREJECTED === "function" ? onREJECTED : () => {};
    if (this.status === Commitment.PENDING) {
      this.resolveCallbacks.push(onFULFIILED);
      this.rejectCallbacks.push(onREJECTED);
    }
    if (this.status === Commitment.FULFILLED) {
      onFULFIILED(this.result);
    }
    if (this.status === Commitment.REJECTED) {
      onREJECTED(this.result);
    }
  }
}

let commitment = new Commitment((res, rej) => {
  console.log("1");
  res(2)
});

commitment.then((result) => {
  console.log(result);
});
