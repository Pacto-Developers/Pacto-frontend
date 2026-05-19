"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const campaigns = [
  {
    id: "1",
    title: "강남역 팝업스토어 리뷰",
    pending: 5,
    approved: 10,
    applicants: [
      { name: "블로거A", url: "https://blog.example.com/a" },
      { name: "블로거B", url: "https://blog.example.com/b" },
    ],
  },
  {
    id: "2",
    title: "신메뉴 시식단 모집",
    pending: 12,
    approved: 3,
    applicants: [{ name: "블로거C", url: "https://blog.example.com/c" }],
  },
];

export function CampaignManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">캠페인 관리</h1>
          <p className="text-muted-foreground">캠페인 생성·승인·진행 상태</p>
        </div>
        <Button>캠페인 만들기</Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>캠페인명</TableHead>
              <TableHead>지원자</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Badge variant="secondary">대기 {campaign.pending}</Badge>
                    <Badge variant="outline">승인 {campaign.approved}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" size="sm" />}>
                      지원자 관리
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{campaign.title}</DialogTitle>
                      </DialogHeader>
                      <ul className="space-y-3">
                        {campaign.applicants.map((applicant) => (
                          <li
                            key={applicant.url}
                            className="flex items-center justify-between gap-3 rounded-lg border p-3"
                          >
                            <div className="min-w-0">
                              <p className="font-medium">{applicant.name}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {applicant.url}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <Button size="sm">승인</Button>
                              <Button size="sm" variant="outline">
                                거절
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
