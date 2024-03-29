import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUniversityDto } from './dto/createUniversity.dto';
import { CreateFacultyDto } from './dto/createFaculty.dto';
import { CreateProgrammeDto } from './dto/createProgramme.dto';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CourseDto } from './dto/course.dto';
import { ProgrammeDto } from './dto/programme.dto';
import { FacultyDto } from './dto/faculty.dto';
import { UniversityDto } from './dto/university.dto';

@Injectable()
export class InfrastructureService {
  constructor(private readonly prismaService: PrismaService) {}
  addUniversity({ name }: CreateUniversityDto) {
    return this.prismaService.university.create({ data: { name } });
  }
  addFaculty({ name, universityId }: CreateFacultyDto) {
    universityId = Number(universityId);
    return this.prismaService.faculty.create({
      data: { name, university: { connect: { id: universityId } } },
    });
  }

  addProgramme({ name, universityId, facultyId }: CreateProgrammeDto) {
    universityId = Number(universityId);
    facultyId = Number(facultyId);
    return this.prismaService.programme.create({
      data: {
        name,
        university: { connect: { id: universityId } },
        faculty: { connect: { id: facultyId } },
      },
    });
  }
  addCourse({
    name,
    semester,
    universityId,
    facultyId,
    programmeId,
    courseType,
    degree,
  }: CreateCourseDto) {
    return this.prismaService.course.create({
      data: {
        name,
        semester: Number(semester),
        university: { connect: { id: Number(universityId) } },
        faculty: { connect: { id: Number(facultyId) } },
        programme: { connect: { id: Number(programmeId) } },
        courseType,
        degree,
      },
    });
  }

  async getUniversities(): Promise<UniversityDto[]> {
    return this.prismaService.university.findMany();
  }
  async getFaculties(universityId: string): Promise<FacultyDto[]> {
    return this.prismaService.faculty.findMany({
      where: { universityId: Number(universityId) },
    });
  }
  async getProgrammes(facultyId: string): Promise<ProgrammeDto[]> {
    return this.prismaService.programme.findMany({
      where: { facultyId: Number(facultyId) },
    });
  }
  async getCourses(programmeId: string): Promise<CourseDto[]> {
    return this.prismaService.course.findMany({
      where: { programmeId: Number(programmeId) },
    });
  }
}
