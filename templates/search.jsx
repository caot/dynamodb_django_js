"use strict";

const buttonStyle = {
  border: 'height: 22px',
};

function form(items, _this) {
  return (
    <form key={ 0 } >
    <p>
      {% csrf_token %}</input>
      <label>net_worth:</label> <input name="net_worth" required />
      <label>location:</label>  <input name="location" />
      <label> </label> <button onClick={_this.handleSubmit} style={buttonStyle}>Search</button>
    </p>
    </form>
  )
}

// https://reactjs.org/docs/faq-ajax.html

// https://reactjs.org/docs/dom-elements.html#style
const tableStyle = {
  border: '1px dotted blue',
};

function table(items, _this) {
  if (items && items.length)
    return (
    <table key={ 1 } style={tableStyle}>
      <tbody>
      <tr>
        <td>person_id</td>
        <td>first_name last_name</td>
        <td>source_of_wealth</td>
        <td>location</td>
        <td>net_worth</td>
      </tr>
      
      {items.map(x => (
      <tr key={ x.id }>
        <td>{ x.id } </td>
        <td>{ x.first_name } { x.last_name }</td>
        <td>{ x.source_of_wealth }</td>
        <td>{ x.location }</td>
        <td>{ x.net_worth }</td>
      </tr>
      ))}
    </tbody> 
    </table>
    )  
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const formData = new FormData(e.target.form)
    const data = {}

    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1]
    }
    console.log(data)

    e.preventDefault();

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    fetch('/search',
    {
      method: 'POST',
      url: '/search',
      headers: {
      // https://stackoverflow.com/questions/35192841/fetch-post-with-multipart-form-data
      // DO NOT supply headers with 'Content-Type' if it's using FormData
      // 'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      // Accept: 'application/json'
      },
      body: formData,
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.Items
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    console.log(items);

    if (error) {
      return <div>Error: {error.message}</div>;
    // } else if (!isLoaded) {
    //  return <div>Loading...</div>;
    } else {
      return [form(items, this), table(items, this)];
    }
  }
}

function render(e, id) {
  ReactDOM.render(e, document.getElementById(id));
};

render(<SearchForm />, 'root');