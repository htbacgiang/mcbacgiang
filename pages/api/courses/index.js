import mongoose from 'mongoose';
import db from '../../../utils/db';
import Course from '../../../models/Course';
import { locationOptions } from '../../../utils/locationMapping';

const allowedLocationCodes = locationOptions.map((loc) => loc.code);

export default async (req, res) => {
  try {
    await db.connectDb();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ status: 'error', err: 'Database connection failed' });
  }

  switch (req.method) {
    case 'GET':
      if (req.query._id) {
        await getCourseById(req, res);
      } else {
        await getCourses(req, res);
      }
      break;
    case 'POST':
      if (req.body.action === 'checkSlug') {
        await checkSlug(req, res);
      } else {
        await createCourse(req, res);
      }
      break;
    case 'PUT':
      await updateCourse(req, res);
      break;
    case 'DELETE':
      await deleteCourse(req, res);
      break;
    default:
      res.status(405).json({ status: 'error', err: 'Method not allowed' });
      break;
  }
};

const getCourses = async (req, res) => {
  try {
    const { level } = req.query;
    const filter = { isDeleted: { $ne: true } };
    
    if (level) filter.level = level;
    
    // Select only the fields we need and exclude deprecated fields
    const courses = await Course.find(filter)
      .select('-instructor -instructorRole -category -targetAge -price -discount -badge -isActive -duration -location')
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      result: courses.length,
      courses,
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ status: 'error', err: 'Error fetching courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.query._id)
      .select('-instructor -instructorRole -category -targetAge -price -discount -badge -isActive -duration -location');
    if (!course) {
      return res.status(404).json({ status: 'error', err: 'Course not found' });
    }
    res.json({
      status: 'success',
      course,
    });
  } catch (err) {
    console.error('Error fetching course by ID:', err);
    return res.status(500).json({ status: 'error', err: 'Error fetching course' });
  }
};

const checkSlug = async (req, res) => {
  try {
    const { slug, _id } = req.body;
    if (!slug) {
      return res.status(400).json({ status: 'error', err: 'Slug is required' });
    }
    const normalizedSlug = slug.trim().toLowerCase();
    console.log(`Checking slug: ${normalizedSlug}, excluding _id: ${_id || 'none'}`);
    const query = { slug: normalizedSlug, isDeleted: { $ne: true } };
    if (_id) {
      query._id = { $ne: _id };
    }
    const existingCourse = await Course.findOne(query);
    console.log(`Slug check result: ${existingCourse ? 'Found' : 'Not found'}`);
    if (existingCourse) {
      return res.status(400).json({ status: 'error', err: 'Slug đã tồn tại' });
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error checking slug:', err);
    return res.status(500).json({ status: 'error', err: 'Error checking slug' });
  }
};

const createCourse = async (req, res) => {
  const session = await Course.startSession();
  try {
    session.startTransaction();

    // Clean up request body - remove deprecated fields
    const cleanedData = { ...req.body };
    delete cleanedData.instructor;
    delete cleanedData.instructorRole;
    delete cleanedData.category;
    delete cleanedData.targetAge;
    delete cleanedData.price;
    delete cleanedData.discount;
    delete cleanedData.badge;
    delete cleanedData.isActive;
    delete cleanedData.duration;
    delete cleanedData.location;

    // Normalize slug
    if (cleanedData.slug) {
      cleanedData.slug = cleanedData.slug.trim().toLowerCase();
    }

    // Normalize and validate locations for Q&K Bắc Giang
    if (cleanedData.locations) {
      const normalizedLocations = Array.isArray(cleanedData.locations)
        ? cleanedData.locations
        : [cleanedData.locations];
      cleanedData.locations = Array.from(
        new Set(normalizedLocations.filter((loc) => allowedLocationCodes.includes(loc)))
      );
    }
    if (!cleanedData.locations || cleanedData.locations.length === 0) {
      cleanedData.locations = [allowedLocationCodes[0]];
    }

    // Convert image array to string if needed
    if (Array.isArray(cleanedData.image)) {
      cleanedData.image = cleanedData.image.length > 0 ? cleanedData.image[0] : '';
    }

    // Check if maKhoaHoc already exists
    const { maKhoaHoc } = cleanedData;
    const existingCourseByMaKhoaHoc = await Course.findOne({ maKhoaHoc, isDeleted: { $ne: true } }).session(session);
    if (existingCourseByMaKhoaHoc) {
      await session.abortTransaction();
      return res.status(400).json({ status: 'error', err: 'Mã khóa học (maKhoaHoc) đã tồn tại' });
    }

    const course = new Course(cleanedData);
    await course.save({ session });

    await session.commitTransaction();
    res.json({
      status: 'success',
      course,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error creating course:', err);
    if (err.code === 11000) {
      if (err.keyPattern.maKhoaHoc) {
        return res.status(400).json({ status: 'error', err: 'Mã khóa học (maKhoaHoc) đã tồn tại' });
      }
      if (err.keyPattern.slug) {
        return res.status(400).json({ status: 'error', err: 'Slug đã tồn tại' });
      }
    }
    return res.status(500).json({ status: 'error', err: err.message || 'Error creating course' });
  } finally {
    session.endSession();
  }
};

const updateCourse = async (req, res) => {
  try {
    // Clean up request body - remove deprecated fields
    const cleanedData = { ...req.body };
    delete cleanedData.instructor;
    delete cleanedData.instructorRole;
    delete cleanedData.category;
    delete cleanedData.targetAge;
    delete cleanedData.price;
    delete cleanedData.discount;
    delete cleanedData.badge;
    delete cleanedData.isActive;
    delete cleanedData.duration;
    delete cleanedData.location;

    // Normalize slug
    if (cleanedData.slug) {
      cleanedData.slug = cleanedData.slug.trim().toLowerCase();
    }

    // Normalize and validate locations for Q&K Bắc Giang
    if (cleanedData.locations !== undefined) {
      const normalizedLocations = Array.isArray(cleanedData.locations)
        ? cleanedData.locations
        : [cleanedData.locations];
      cleanedData.locations = Array.from(
        new Set(normalizedLocations.filter((loc) => allowedLocationCodes.includes(loc)))
      );
      if (cleanedData.locations.length === 0) {
        cleanedData.locations = [allowedLocationCodes[0]];
      }
    }

    // Convert image array to string if needed
    if (Array.isArray(cleanedData.image)) {
      cleanedData.image = cleanedData.image.length > 0 ? cleanedData.image[0] : '';
    }

    const { maKhoaHoc } = cleanedData;

    // Check if maKhoaHoc is being changed to an existing one
    if (maKhoaHoc) {
      const existingCourseByMaKhoaHoc = await Course.findOne({
        maKhoaHoc,
        _id: { $ne: req.query._id },
        isDeleted: { $ne: true },
      });
      if (existingCourseByMaKhoaHoc) {
        return res.status(400).json({ status: 'error', err: 'Mã khóa học (maKhoaHoc) đã tồn tại' });
      }
    }

    const course = await Course.findByIdAndUpdate(req.query._id, cleanedData, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ status: 'error', err: 'Course not found' });
    }
    res.json({
      status: 'success',
      course,
    });
  } catch (err) {
    console.error('Error updating course:', err);
    if (err.code === 11000) {
      if (err.keyPattern.maKhoaHoc) {
        return res.status(400).json({ status: 'error', err: 'Mã khóa học (maKhoaHoc) đã tồn tại' });
      }
      if (err.keyPattern.slug) {
        return res.status(400).json({ status: 'error', err: 'Slug đã tồn tại' });
      }
    }
    return res.status(500).json({ status: 'error', err: err.message || 'Error updating course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.query._id,
      { isDeleted: true },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ status: 'error', err: 'Course not found' });
    }
    res.json({
      status: 'success',
      message: 'Course soft deleted',
    });
  } catch (err) {
    console.error('Error deleting course:', err);
    return res.status(500).json({ status: 'error', err: 'Error deleting course' });
  }
};

