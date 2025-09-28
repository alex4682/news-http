import { Component } from 'react';
import './App.css';

export default class App extends Component {
  state = {
    api: this.props.api,
    news: null,
    page: this.props.page
  }

  async getData() {
    try {
      const response = await fetch(this.state.api);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  getNews = async () => {
    const data = await this.getData();
    if (data) {
      this.setState({ news: data.hits });
      console.log(data.hits);
    }
  }

  componentDidMount() {
    this.getNews();
  }

  prevPage = () => {
    if (this.state.page > 0) {
      const newPage = this.state.page - 1;
      const newApi = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${newPage}&hitsPerPage=21`;
      this.setState({ page: newPage, api: newApi }, this.getNews);
    }
  }
  nextPage = () => {
    const newPage = this.state.page + 1;
    const newApi = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${newPage}&hitsPerPage=21`;
    this.setState({ page: newPage, api: newApi }, this.getNews);
  }

  formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  }

  render() {
    return (
      <div>
        <div className='btnWrap'><button onClick={this.prevPage}>Prev</button>
          <button onClick={this.nextPage}>Next</button></div>
        {this.state.news && (
          <ul>
            {this.state.news.map(item => (
              <li key={item.objectID}>
                <h2>{item.title}</h2>
                {item.author && <p>Author: {item.author}</p>}
                <p>{this.formatDate(item.created_at)}</p>
                <p>Comments: {item.num_comments}</p>
                {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a> : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}