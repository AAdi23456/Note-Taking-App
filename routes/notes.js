
const express = require('express');
const router = express.Router();
const Note = require('../model/notes');
const {validateNote,handleErrors}=require('../middleware/notes')
// Create Note
router.post('/',validateNote, async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// Retrieve Notes
router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// Retrieve Single Note by ID
router.get('/:noteId', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// Update Note
router.put('/:noteId',validateNote, async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// Delete Note
router.delete('/:noteId', async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
});
router.use(handleErrors)
module.exports = router;
