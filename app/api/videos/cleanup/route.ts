import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Video } from '@/lib/entities/Video';
import { VideoComment } from '@/lib/entities/VideoComment';
import { deleteFromR2, extractR2Key } from '@/lib/r2';
import { LessThan } from 'typeorm';

// POST cleanup videos older than 24 hours
export async function POST() {
  try {
    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    const commentRepo = dataSource.getRepository(VideoComment);

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Get videos that will be deleted to extract their file URLs
    const videosToDelete = await videoRepo.find({
      where: {
        createdAt: LessThan(twentyFourHoursAgo)
      }
    });

    // Delete videos created more than 24 hours ago
    await videoRepo.remove(videosToDelete);

    // Note: Comments with CASCADE foreign key will be automatically deleted
    // But if needed, we can explicitly delete orphaned comments
    const allVideoIds = (await videoRepo.find()).map(v => v.id);
    if (allVideoIds.length > 0) {
      await commentRepo.createQueryBuilder()
        .delete()
        .where('video_id NOT IN (:...ids)', { ids: allVideoIds })
        .execute();
    }

    // Delete files from R2 (async, don't block the response)
    videosToDelete.forEach(video => {
      if (video.videoUrl) {
        deleteFromR2(extractR2Key(video.videoUrl)).catch(err => 
          console.error('Failed to delete video from R2:', err)
        );
      }
      if (video.thumbnail) {
        deleteFromR2(extractR2Key(video.thumbnail)).catch(err => 
          console.error('Failed to delete thumbnail from R2:', err)
        );
      }
    });

    return NextResponse.json({ 
      success: true, 
      deleted: videosToDelete.length 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to cleanup videos' }, { status: 500 });
  }
}

