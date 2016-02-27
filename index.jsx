var React = require('react');
var ReactDOM = require('react-dom');

var Result = React.createClass({

    format: function(num, decimals, groupsize) {
        var re = '\\d(?=(\\d{' + (groupsize || 3) + '})+' + (decimals > 0 ? '\\.' : '$') + ')';
        return parseFloat(num).toFixed(Math.max(0, ~~decimals)).replace(new RegExp(re, 'g'), '$&,');
    },

    render: function() {

        var amts = Object.keys(this.props.amounts).map(function(a) {
            return this.props.amounts[a] > 0 ? (<tr><td>{ a + 'k skillpoints '}</td><td>{ this.props.amounts[a] + ' injectors' }</td></tr>) : null;
        }.bind(this));

        return (
            <div>
                <h5>Result</h5>
                <table className="pure-table pure-table-horizontal">
                    <tr>
                        <td><b className="color-fg-green">Skillpoints Gained</b></td><td>{ this.format(this.props.gained) }</td>
                    </tr>
                    <tr>
                        <td><b className="color-fg-blue">Injectors</b></td><td>{ this.props.injectors }</td>
                    </tr>
                    <tr>
                        <td><b className="color-fg-orange">Final SP</b></td><td>{ this.format(this.props.sp) }</td>
                    </tr>

                </table>
                <h5>Amounts injected</h5>
                <table className="pure-table pure-table-horizontal">
                    { amts }
                </table>
            </div>
        );
    }

});

module.exports = Result;

var Calculator = React.createClass({
    onSubmit: function(e) {
        console.log('calculating');
        var thisDom = ReactDOM.findDOMNode(this);

        var currentSp = parseInt(thisDom.querySelector('#cskillpoints').value);
        var targetSp = parseInt(thisDom.querySelector('#tskillpoints').value);
        var gainedSp = parseInt(thisDom.querySelector('#gskillpoints').value);
        var injectors = parseInt(thisDom.querySelector('#injectors').value);

        var amountInjected = function(csp) {
            switch (true) {
                case (csp < 5000000): return 500000;
                case (csp < 50000000): return 400000;
                case (csp < 80000000): return 300000;
                default: return 150000;
            }
        };

        var amounts = {
            500: 0,
            400: 0,
            300: 0,
            150: 0
        };
        var ai;
        console.log(currentSp, targetSp, gainedSp, injectors);
        if (injectors > 0) {
            var ti = 0;
            for (var i = 0; i < injectors; i++) {
                ai = amountInjected(currentSp + ti);
                ti += ai;
                amounts[ai/1000]++;
            }

            this.setState({result: (
                <Result amounts={ amounts } gained={ ti } injectors={ injectors } sp={ currentSp + ti }/>
            )});
        } else if (targetSp > 0 || gainedSp > 0) {
            gainedSp = gainedSp || targetSp - currentSp;
            var gsp = gainedSp;
            var inj = 0;
            while (gsp > 0) {
                ai = amountInjected(currentSp + (gainedSp - gsp));
                console.log('injected', ai, 'coz', currentSp + (gainedSp - gsp));
                inj++;
                gsp -= ai;
                amounts[ai/1000]++;
            }
            this.setState({result: (
                <Result amounts={ amounts } gained={ gainedSp - gsp } injectors={ inj } sp={ currentSp + (gainedSp - gsp) }/>
            )});
        }

        e.preventDefault();
    },


    getInitialState: function() {
        return {
            result: null
        };
    },

    render: function() {
        return (
            <div className="pure-g">
                <div className="pure-u-2-5">
                </div>
                <div className="pure-u-1-5">
                    <form className="pure-form pure-form-stacked" onSubmit={ this.onSubmit }>
                        <h4 className="color-fg-blue">Input Skillpoints and/or Injectors
                        <hr /></h4>
                        <fieldset>
                            <label htmlFor="cskillpoints">Current Skillpoints</label>
                            <input
                                id="cskillpoints"
                                placeholder="Current skillpoints" />
                            <h5 className="color-fg-orange">Pick one of the following
                            <hr /></h5>

                            <label htmlFor="tskillpoints">Target Skillpoints</label>
                            <input
                                id="tskillpoints"
                                placeholder="Skillpoint target" />
                            <label htmlFor="gskillpoints">Gained Skillpoints</label>
                                <input
                                    id="gskillpoints"
                                    type="text"
                                    placeholder="Gain how many skillpoints?" />
                            <label htmlFor="injectors">Consumed Injectors</label>
                            <input
                                id="injectors"
                                type="text"
                                placeholder="Use how many injectors?" />
                            <br /><hr /><br />
                            <button
                                type="submit"
                                className="pure-button color-bg-green">
                                Calculate
                            </button>
                        </fieldset>
                    </form>
                    <div>
                        { this.state.result }
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Calculator;

ReactDOM.render(<Calculator />, document.getElementById('calcdiv'));
