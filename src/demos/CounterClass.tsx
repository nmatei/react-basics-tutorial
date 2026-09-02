import { Component } from "react";
import { Button } from "@/components/ui/button";

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
    // Pas de curatare — acelasi invelis si aceleasi variante de buton ca in
    // varianta cu hooks: cele doua ecrane demonstreaza acelasi lucru, deci
    // trebuie sa arate identic. Diferenta pe care o predau e in cod, nu in stil.
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
        <p className="text-foreground text-6xl leading-none font-semibold">{this.state.count}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              console.info("who is this?", this);
              this.increment();
            }}
          >
            +1
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={function (this: any) {
              console.info("who is this?", this);
              //this.increment()
            }}
          >
            +1
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={this.decrement}>
            -1
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={this.reset}>
            Reset
          </Button>
        </div>
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
