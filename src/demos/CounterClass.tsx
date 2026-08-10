import { Component } from "react";

type CounterClassState = { count: number };

// Component<P, S>: P = tipul props-urilor (nu avem, deci `object`), S = tipul
// starii. React are nevoie de S ca sa stie ce accepta setState.
export class CounterClass extends Component<object, CounterClassState> {
  // Echivalentul lui `useState(0)`. Ruleaza o singura data, la construirea
  // instantei — nu la fiecare render, ca la o functie.
  state: CounterClassState = { count: 0 };

  increment = () => {
    this.setState(s => ({ count: s.count + 1 }));
  };

  decrement = () => {
    this.setState(s => ({ count: s.count - 1 }));
  };

  reset = () => {
    this.setState({
      count: 0
    });

    //this.state.count = 0 // this is not a good practice...
  };

  // mySetState = () => {
  //   this.state.count = 3 // this is not a good practice...
  //   this.render();
  // }

  // render() e echivalentul corpului functiei din varianta cu hooks. Il
  // apeleaza React, niciodata tu. Nu are voie sa schimbe starea — doar sa
  // descrie ce trebuie afisat pentru starea curenta.
  render() {
    console.log("CounterClass render", this.state.count);
    return (
      <div>
        <p style={{ fontSize: 64, margin: 0 }}>{this.state.count}</p>

        <button
          type="button"
          onClick={() => {
            console.info("who is this?", this);
            this.increment();
          }}
        >
          +1
        </button>
        <button
          type="button"
          onClick={function (this: any) {
            console.info("who is this?", this);
            //this.increment()
          }}
        >
          +1
        </button>
        <button type="button" onClick={this.decrement}>
          -1
        </button>
        <button type="button" onClick={this.reset}>
          Reset
        </button>
      </div>
    );
  }
}

// De ce in cod NOU scriem totusi functii + hooks:
// - Mai putin boilerplate: nicio clasa, niciun `this`, nicio capcana de binding.
// - Logica de stare se poate extrage si refolosi intr-un hook propriu
//   (useCounter). La clase nu exista echivalent — se ajungea la HOC-uri si
//   render props, adica ierarhii de componente greu de citit.
// - Clasele NU sunt scoase din React si nu se strica, dar sunt in modul
//   "intretinere": nu mai primesc functionalitati noi si nu pot folosi hooks.
