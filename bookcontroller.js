const express = require('express');
const router = express.Router();
const Book = require('./Model/bookSchema');
const Borrow = require('./Model/borrowSchema');
const Return = require('./Model/returnSchema');


router.get('/',async (req,res)=>{
    try{
 let documents = await Book.find({});
 res.send(documents)
    }
    catch(error){
res.status(400).send("error in retrieving the documents")

    }

})

router.post('/',async(req,res)=>{

const { name, author, genre, type, available } = req.body;
const book = new Book({ name, author, genre, type, available });
await book.save();
res.status(201).json({ message: 'Book successfully added', book });

})

router.post('/borrow/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const username = req.user.username;

        // Check if the book is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (!book.available) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Create a new borrow record
        const borrow = new Borrow({
            username: username,
            bookid: book._id,
           
        });

        await borrow.save();     

        res.status(200).json({ message: 'Book borrowed successfully', borrow });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

router.post('/return/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const username = req.user.username;

        // Find the borrow record
        const borrowRecord = await Borrow.findOne({ bookid: bookId, username: username });
        if (!borrowRecord) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        // Calculate fine if the book is returned late
        const currentDate = new Date();
        const dueDate = borrowRecord.duedate;
        let fine = 0;
        if (currentDate > dueDate) {
            const daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
            fine = daysLate * 50; //fine of 10 rupees per day
        }

        // Update the book's availability
        await Book.findByIdAndUpdate(bookId, { available: true });

        // Create a return record
        const returnRecord = new Return({
            username: username,
            bookid: bookId,
            duedate: dueDate,
            fine: fine
        });

        await returnRecord.save();

        // Remove the borrow record
        await Borrow.deleteOne({ _id: borrowRecord._id });

        res.status(200).json({ message: 'Book returned successfully', returnRecord });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

router.put('/update/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const updateData = req.body;

        // Update the book with the new data
        const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book updated successfully', updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

module.exports = router;