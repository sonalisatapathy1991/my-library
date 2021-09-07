import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import './App.css';
import { useState, useCallback, useRef, useEffect } from 'react';


function App() {
  const [searchTitle, setSearchTitle] = useState('');
  const [bookList, setBookList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [titleSort, setTitleSort] = useState(false);
  const [yearSort, setYearSort] = useState(false);

  const inputRef = useRef(null);

  const allBookLists = useCallback(() => {
    setLoader(true)
    const serchBook = searchTitle.split(' ').join('+');
    fetch(`http://openlibrary.org/search.json?q=${serchBook}`).then(response => response.json())
      .then(books => {
        setLoader(false);
        setBookList(books.docs)
      })
      .catch(err => {
        console.log('error', err)
      })
  }, [searchTitle]);
  useEffect(() => {
    inputRef.current.focus();

  }, []);
  const updateSearch = (e) => {
    setSearchTitle(e.target.value);

    if (!e.target.value) {
      setBookList([])
    }
  }
  const sortByTitle = () => {
    setTitleSort(!titleSort);
    sortBy('title', titleSort);
  }
  const sortByYear = () => {
    setYearSort(!yearSort);
    sortBy('first_publish_year', yearSort);
  }
  const compareBy = (key, ascending) => {
    let reverse = ascending ? 1 : -1;
    return function (a, b) {
      if (a[key] < b[key]) return -1 * reverse;
      if (a[key] > b[key]) return 1 * reverse;
      return 0;
    };
  }

  const sortBy = (key, ascending) => {
    let arrayCopyBooks = [...bookList];
    arrayCopyBooks.sort(compareBy(key, ascending));
    setBookList(arrayCopyBooks)
  }
  console.log('myDAta', bookList.length)
  return (
    <Container>
      <Row>
        <Col xs={{ span: 6, offset: 3 }}>
          <input type="text" ref={inputRef} placeholder="Search book title" defaultValue={searchTitle || ''} className="searchFeield" onChange={e => updateSearch(e)} />
          <button onClick={allBookLists}>Search</button>
        </Col>
      </Row>
      {loader &&
        <Row className="justify-content-center loader">
          <Col xs={{ span: 7, offset: 5 }}>
            <Spinner animation="border" />
          </Col>
        </Row>
      }


      {bookList && bookList.length > 0 ?
        <Table striped bordered hover responsive="sm" className="bookList">
          <thead>
            <tr>


              <th>Book Cover</th>
              <th >Title <span onClick={sortByTitle}><i className="fa fa-sort" ></i></span></th>
              <th>Author</th>
              <th>Publish Year <span onClick={sortByYear}><i className="fa fa-sort" aria-hidden="true"></i></span> </th>
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
        </Table> : ''
      }
      {/* <Row className="justify-content-center loader">
          <Col xs={{ span: 7, offset: 5 }}> Sorry no record found!</Col></Row> */}
    </Container>
  );
}

export default App;
