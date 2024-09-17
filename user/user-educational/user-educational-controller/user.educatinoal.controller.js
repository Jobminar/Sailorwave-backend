import Education from '../user-educational-model/user.educational.model.js'

const educationController = {
  // Create a new education entry
  createEducation: async (req, res) => {
    const { userId, examPassed, schoolOrCollege, yearOfPassing, percentage } = req.body;
    try {
      const newEducation = new Education({
        userId,
        examPassed,
        schoolOrCollege,
        yearOfPassing,
        percentage,
      });

      await newEducation.save();
      res.status(201).json({ message: 'Education entry created successfully', education: newEducation });
    } catch (error) {
      res.status(500).json({ message: 'Error creating education entry', error: error.message });
    }
  },

  // Get an education entry by ID
  getEducationById: async (req, res) => {
    const { userId } = req.params;
    try {
      const education = await Education.find({userId}).populate('userId');
      if (!education) {
        return res.status(404).json({ message: 'Education entry not found' });
      }

      res.status(200).json(education);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving education entry', error: error.message });
    }
  },

  getAllEducation: async(req,res) =>{
    try{
      const education=await Education.find()
      res.status(200).json(education)
    }
      catch(error){
      res.status(500).json({error:"Failed to get data",err:error})
    }
  },

  // Update an education entry
  updateEducation: async (req, res) => {
    const { id } = req.params;
    const { examPassed, schoolOrCollege, yearOfPassing, percentage } = req.body;
    try {
      const education = await Education.findById(id);
      if (!education) {
        return res.status(404).json({ message: 'Education entry not found' });
      }

      if (examPassed) education.examPassed = examPassed;
      if (schoolOrCollege) education.schoolOrCollege = schoolOrCollege;
      if (yearOfPassing) education.yearOfPassing = yearOfPassing;
      if (percentage) education.percentage = percentage;

      await education.save();
      res.status(200).json({ message: 'Education entry updated successfully', education });
    } catch (error) {
      res.status(500).json({ message: 'Error updating education entry', error: error.message });
    }
  },

  // Delete an education entry
  deleteEducation: async (req, res) => {
    const { id } = req.params;
    try {
      const education = await Education.findByIdAndDelete(id);
  
      if (!education) {
        return res.status(404).json({ message: 'Education entry not found' });
      }
  
      res.status(200).json({ message: 'Education entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting education entry', error: error.message });
    }
  },
  
};

export default educationController;
