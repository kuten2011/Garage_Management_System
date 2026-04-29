package DACNTT.garage.mapper;

import DACNTT.garage.dto.ReportDTO;
import DACNTT.garage.model.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    @Mapping(source = "chiNhanh.maChiNhanh", target = "maChiNhanh")
    ReportDTO toReportDTO(Report report);

}
