
  const http = require('http');
  const handler = require('./handlers');
  const { getAllBooks, getBooksByCat, updateBook,createBook, deleteBookByCatAndId } = require('./controller');
  
  // Versions
  const apiV1 = '/api/v1';
  
  const server = http.createServer((req, res) => {
    if (req.url === `${apiV1}/books/all` && req.method === 'GET') {
      handler(res, 200, getAllBooks());
    } else if (req.url === `${apiV1}/books/science/all` && req.method === 'GET') {
      handler(res, 200, getBooksByCat('science'));
    } 
    else if (req.url === `${apiV1}/add/books` && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const book = JSON.parse(body);
        const createdBook = createBook(book);
        handler(res, 201, createdBook);
      });
    } 
    else if (req.url === `${apiV1}/books/update` && req.method === 'PUT') {
      let requestBody = '';
      req.on('data', (chunk) => {
        requestBody += chunk.toString();
      });
      req.on('end', () => {
        const updatedBook = JSON.parse(requestBody);
        const result = updateBook(updatedBook.category, updatedBook);
        if (result === 'Book updated successfully.') {
          handler(res, 200, result);
        } else {
          handler(res, 404, result);
        }
      });
    }
    else if (req.url.startsWith(`${apiV1}/books/`)) {
      const [_, category, bookId] = req.url.split('/');


      
    
      if (req.method === 'DELETE') {
        const isDeleted = deleteBookByCatAndId(category, parseInt(bookId));
    
        if (isDeleted) {
          handler(res, 200, 'Book deleted successfully');
        } else {
          handler(res, 404, 'Book not found');
        }
      } else {
        handler(res, 405, 'Method Not Allowed');
      }
    }
    
    else {
      res.end('Invalid request');
    }
  });
  
  server.listen(5000, () => {
    console.log('Listening on port 5000');
  });
  



  