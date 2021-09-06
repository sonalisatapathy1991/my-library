import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Table } from 'react-bootstrap';
import './App.css';
import { useState, useCallback } from 'react';


function App() {
  const [searchTitle, setSearchTitle] = useState('');
  const [bookList, setBookList] = useState([]);

  const allBookLists = useCallback(() => {
    const serchBook = searchTitle.split(' ').join('+');
    fetch(`http://openlibrary.org/search.json?q=title: ${serchBook}`).then(response => response.json())
      .then(books => setBookList(books.docs))
      .catch(err => {
        console.log(err)
      })
  }, [searchTitle]);

  console.log('myDAta', bookList.length)
  return (
    <Container>
      <Row>
        <Col xs={{ span: 6, offset: 3 }}>
          <input type="text" placeholder="Search book title" defaultValue={searchTitle || ''} className="searchFeield" onChange={e => setSearchTitle(e.target.value)} />
          <button onClick={allBookLists}>Search</button>
        </Col>
      </Row>
      <Table striped bordered hover responsive="sm" className="bookList">
        <thead>
          <tr>


            <th>Book Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publish Date</th>
          </tr>
        </thead>
        <tbody>
          {
            bookList.map(book => {
              return (
                <tr key={book.key}>


                  <td>

                    {
                      parseInt(book.isbn).toString() !== '' ? <img src={`http://covers.openlibrary.org/b/isbn/${parseInt(book.isbn).toString()}-S.jpg`} alt={book.title} /> :
                        <img src={`../public/avatar_book-sm.png`} alt={book.title} />
                    }


                  </td>
                  <td>{book.title}</td>
                  <td>{book.author_name}</td>
                  <td>{book.first_publish_year}</td>
                </tr>
              )
            })
          }


        </tbody>
      </Table>
    </Container>
  );
}

export default App;
