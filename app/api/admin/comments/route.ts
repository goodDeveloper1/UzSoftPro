import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { VideoComment } from '@/lib/entities/VideoComment';

// GET all comments (for admin)
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const commentRepo = dataSource.getRepository(VideoComment);
    
    const comments = await commentRepo
      .createQueryBuilder('vc')
      .leftJoinAndSelect('vc.video', 'v')
      .select([
        'vc.id',
        'vc.videoId',
        'vc.comment',
        'vc.authorName',
        'vc.isApproved',
        'vc.createdAt',
        'v.title',
        'v.thumbnail'
      ])
      .orderBy('vc.createdAt', 'DESC')
      .getRawMany();
    
    // Format the response to match the old structure
    const formattedComments = comments.map(c => ({
      id: c.vc_id,
      video_id: c.vc_videoId,
      comment: c.vc_comment,
      author_name: c.vc_authorName,
      is_approved: c.vc_isApproved,
      created_at: c.vc_createdAt,
      video_title: c.v_title,
      video_thumbnail: c.v_thumbnail,
    }));
    
    return NextResponse.json({ success: true, data: formattedComments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// PUT approve/delete comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body; // action: 'approve' or 'delete'

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'ID and action required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const commentRepo = dataSource.getRepository(VideoComment);
    
    const comment = await commentRepo.findOne({ where: { id } });
    if (!comment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    if (action === 'approve') {
      comment.isApproved = 1;
      await commentRepo.save(comment);
    } else if (action === 'delete') {
      await commentRepo.remove(comment);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update comment' }, { status: 500 });
  }
}

