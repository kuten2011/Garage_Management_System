package DACNTT.garage.mapper;

import DACNTT.garage.dto.FeedbackDTO;
import DACNTT.garage.model.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    @Mapping(source = "phieuSuaChua.maPhieu", target = "maPSC")
    @Mapping(source = "phieuSuaChua.xe.bienSo", target = "bienSo")
    @Mapping(source = "phieuSuaChua.lichHen.khachHang.hoTen", target = "hoTenKhach")
    @Mapping(source = "phieuSuaChua.lichHen.khachHang.maKH", target = "maKH")
    FeedbackDTO toFeedbackDTO(Feedback feedback);

    @Mapping(target = "phieuSuaChua", ignore = true)
    Feedback toEntity(FeedbackDTO dto);
}